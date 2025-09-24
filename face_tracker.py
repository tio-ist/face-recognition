import cv2
import numpy as np
import random
import time

class FaceTracker:
    def __init__(self):
        # Initialize face detection
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        
        # Turkish adjectives
        self.adjectives = [
            "tatli", "mutlu", "sarhos", "guzel", "yakisikli", "sirin", 
            "neseli", "uzgun", "yorgun", "enerjik", "sakin", "heyecanli",
            "kizgin", "saskin", "gururlu", "utangac", "cesur", "korkak",
            "akilli", "aptal", "comert", "cimri", "dostane", "dusmanca"
        ]
        
        # Track faces and their labels
        self.face_tracker = {}  # face_id -> (label, last_seen, position)
        self.face_id_counter = 0
        self.max_distance = 100  # Max distance to consider same face
        self.max_absent_time = 2.0  # Seconds before considering face lost
        
    def get_random_adjective(self):
        return random.choice(self.adjectives)
    
    def calculate_distance(self, pos1, pos2):
        x1, y1, w1, h1 = pos1
        x2, y2, w2, h2 = pos2
        center1 = (x1 + w1//2, y1 + h1//2)
        center2 = (x2 + w2//2, y2 + h2//2)
        return np.sqrt((center1[0] - center2[0])**2 + (center1[1] - center2[1])**2)
    
    def find_closest_face(self, new_face, existing_faces):
        min_distance = float('inf')
        closest_face_id = None
        
        for face_id, (label, last_seen, position) in existing_faces.items():
            distance = self.calculate_distance(new_face, position)
            if distance < min_distance and distance < self.max_distance:
                min_distance = distance
                closest_face_id = face_id
        
        return closest_face_id, min_distance
    
    def update_face_tracking(self, detected_faces):
        current_time = time.time()
        
        # Create a copy of current faces
        current_faces = dict(self.face_tracker)
        matched_faces = set()
        
        # Try to match new detections with existing faces
        for face in detected_faces:
            closest_id, distance = self.find_closest_face(face, current_faces)
            
            if closest_id is not None:
                # Update existing face
                label, last_seen, old_position = current_faces[closest_id]
                self.face_tracker[closest_id] = (label, current_time, face)
                matched_faces.add(closest_id)
            else:
                # New face detected
                new_label = self.get_random_adjective()
                new_face_id = f"face_{self.face_id_counter}"
                self.face_id_counter += 1
                self.face_tracker[new_face_id] = (new_label, current_time, face)
                matched_faces.add(new_face_id)
                print(f"New person: {new_label}")
        
        # Remove faces that haven't been seen recently
        faces_to_remove = []
        for face_id, (label, last_seen, position) in self.face_tracker.items():
            if face_id not in matched_faces:
                if current_time - last_seen > self.max_absent_time:
                    faces_to_remove.append(face_id)
        
        for face_id in faces_to_remove:
            old_label = self.face_tracker[face_id][0]
            del self.face_tracker[face_id]
            print(f"Person left: {old_label}")
    
    def draw_annotations(self, frame, detected_faces):
        # Update face tracking
        self.update_face_tracking(detected_faces)
        
        # Draw annotations for tracked faces
        for face_id, (label, last_seen, position) in self.face_tracker.items():
            x, y, w, h = position
            
            # Draw red bounding box
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 0, 255), 2)
            
            # Draw text above the face
            text_size = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)[0]
            text_x = x + (w - text_size[0]) // 2
            text_y = y - 10
            
            if text_y < 20:
                text_y = y + h + 25
            
            # Draw text background
            cv2.rectangle(frame, 
                        (text_x - 3, text_y - text_size[1] - 3),
                        (text_x + text_size[0] + 3, text_y + 3),
                        (0, 0, 0), -1)
            
            # Draw text
            cv2.putText(frame, label, (text_x, text_y), 
                      cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
    
    def run(self):
        # Initialize camera
        cap = cv2.VideoCapture(0)
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        cap.set(cv2.CAP_PROP_FPS, 30)
        cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
        
        if not cap.isOpened():
            print("Error: Could not open camera")
            return
        
        print("Face Tracker Started!")
        print("Features:")
        print("- Red bounding boxes around faces")
        print("- Turkish adjectives above each face")
        print("- Same person keeps same label until they leave")
        print("Press 'q' to quit")
        
        try:
            while True:
                ret, frame = cap.read()
                if not ret:
                    print("Error: Could not read frame")
                    break
                
                # Flip frame horizontally for mirror effect
                frame = cv2.flip(frame, 1)
                
                # Convert to grayscale for face detection
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                
                # Detect faces
                faces = self.face_cascade.detectMultiScale(
                    gray,
                    scaleFactor=1.1,
                    minNeighbors=5,
                    minSize=(30, 30),
                    flags=cv2.CASCADE_SCALE_IMAGE
                )
                
                if len(faces) > 0:
                    self.draw_annotations(frame, faces)
                
                # Display frame
                cv2.imshow('Face Tracker - Turkish Adjectives', frame)
                
                # Check for quit
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break
                    
        except KeyboardInterrupt:
            print("\nApplication interrupted by user")
        except Exception as e:
            print(f"Error: {e}")
        finally:
            cap.release()
            cv2.destroyAllWindows()
            print("Face tracker stopped")

if __name__ == "__main__":
    tracker = FaceTracker()
    tracker.run()
