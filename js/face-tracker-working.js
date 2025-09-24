class FaceTracker {
    constructor() {
        this.video = document.getElementById('video');
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.status = document.getElementById('status');
        
        // Turkish adjectives (ASCII-compatible)
        this.adjectives = [
            "tatli", "mutlu", "sarhos", "guzel", "yakisikli", "sirin", 
            "neseli", "uzgun", "yorgun", "enerjik", "sakin", "heyecanli",
            "kizgin", "saskin", "gururlu", "utangac", "cesur", "korkak",
            "akilli", "aptal", "comert", "cimri", "dostane", "dusmanca",
            "sicak", "soguk", "genc", "yasli", "guclu", "zayif", "komik",
            "ciddi", "rahat", "gergin", "ozguvenli", "cekingen", "sosyal"
        ];
        
        // Face tracking
        this.faceTracker = new Map();
        this.faceIdCounter = 0;
        this.maxDistance = 100;
        this.maxAbsentTime = 2000;
        
        // Face detection
        this.isTracking = false;
        this.detectionInterval = null;
        
        this.setupEventListeners();
        this.populateAdjectives();
    }
    
    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.startTracking());
        this.stopBtn.addEventListener('click', () => this.stopTracking());
    }
    
    populateAdjectives() {
        const adjectiveList = document.getElementById('adjectiveList');
        this.adjectives.forEach(adj => {
            const tag = document.createElement('span');
            tag.className = 'adjective-tag';
            tag.textContent = adj;
            adjectiveList.appendChild(tag);
        });
    }
    
    getRandomAdjective() {
        return this.adjectives[Math.floor(Math.random() * this.adjectives.length)];
    }
    
    calculateDistance(pos1, pos2) {
        const center1 = {
            x: pos1.x + pos1.width / 2,
            y: pos1.y + pos1.height / 2
        };
        const center2 = {
            x: pos2.x + pos2.width / 2,
            y: pos2.y + pos2.height / 2
        };
        
        return Math.sqrt(
            Math.pow(center1.x - center2.x, 2) + 
            Math.pow(center1.y - center2.y, 2)
        );
    }
    
    findClosestFace(newFace, existingFaces) {
        let minDistance = Infinity;
        let closestFaceId = null;
        
        for (const [faceId, faceData] of existingFaces) {
            const distance = this.calculateDistance(newFace, faceData.position);
            if (distance < minDistance && distance < this.maxDistance) {
                minDistance = distance;
                closestFaceId = faceId;
            }
        }
        
        return closestFaceId;
    }
    
    updateFaceTracking(detectedFaces) {
        const currentTime = Date.now();
        const currentFaces = new Map(this.faceTracker);
        const matchedFaces = new Set();
        
        // Try to match new detections with existing faces
        detectedFaces.forEach(face => {
            const closestId = this.findClosestFace(face, currentFaces);
            
            if (closestId) {
                // Update existing face
                const faceData = currentFaces.get(closestId);
                this.faceTracker.set(closestId, {
                    label: faceData.label,
                    lastSeen: currentTime,
                    position: face
                });
                matchedFaces.add(closestId);
            } else {
                // New face detected
                const newLabel = this.getRandomAdjective();
                const newFaceId = `face_${this.faceIdCounter++}`;
                this.faceTracker.set(newFaceId, {
                    label: newLabel,
                    lastSeen: currentTime,
                    position: face
                });
                matchedFaces.add(newFaceId);
                console.log(`New person: ${newLabel}`);
            }
        });
        
        // Remove faces that haven't been seen recently
        const facesToRemove = [];
        for (const [faceId, faceData] of this.faceTracker) {
            if (!matchedFaces.has(faceId)) {
                if (currentTime - faceData.lastSeen > this.maxAbsentTime) {
                    facesToRemove.push(faceId);
                }
            }
        }
        
        facesToRemove.forEach(faceId => {
            const oldLabel = this.faceTracker.get(faceId).label;
            this.faceTracker.delete(faceId);
            console.log(`Person left: ${oldLabel}`);
        });
    }
    
    drawAnnotations() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw annotations for tracked faces
        for (const [faceId, faceData] of this.faceTracker) {
            const { x, y, width, height } = faceData.position;
            
            // Draw red bounding box
            this.ctx.strokeStyle = '#ff0000';
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(x, y, width, height);
            
            // Draw text above the face
            const label = faceData.label;
            this.ctx.font = 'bold 20px Arial';
            this.ctx.fillStyle = '#ff0000';
            this.ctx.textAlign = 'center';
            
            const textX = x + width / 2;
            const textY = y - 10;
            
            // Draw text background
            const textWidth = this.ctx.measureText(label).width;
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            this.ctx.fillRect(
                textX - textWidth / 2 - 5,
                textY - 25,
                textWidth + 10,
                30
            );
            
            // Draw text
            this.ctx.fillStyle = '#ff0000';
            this.ctx.fillText(label, textX, textY);
        }
    }
    
    async startTracking() {
        try {
            this.status.textContent = 'Starting camera...';
            
            // Get user media
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user'
                }
            });
            
            this.video.srcObject = stream;
            this.video.play();
            
            // Wait for video to be ready
            this.video.addEventListener('loadedmetadata', () => {
                this.canvas.width = this.video.videoWidth;
                this.canvas.height = this.video.videoHeight;
                this.startFaceDetection();
            });
            
        } catch (error) {
            console.error('Error starting camera:', error);
            this.status.textContent = 'Error starting camera. Please check permissions.';
        }
    }
    
    startFaceDetection() {
        this.isTracking = true;
        this.startBtn.disabled = true;
        this.stopBtn.disabled = false;
        this.status.textContent = 'Face tracking started!';
        
        // Start face detection loop
        this.detectFaces();
    }
    
    detectFaces() {
        if (!this.isTracking) return;
        
        // Simulate face detection for demo
        // In a real implementation, you'd use a proper face detection library
        const faces = this.simulateFaceDetection();
        
        if (faces.length > 0) {
            this.updateFaceTracking(faces);
        }
        
        this.drawAnnotations();
        
        // Update status
        this.status.textContent = `Tracking ${this.faceTracker.size} faces`;
        
        // Continue detection
        setTimeout(() => this.detectFaces(), 100); // 10 FPS
    }
    
    simulateFaceDetection() {
        // This simulates face detection for demo purposes
        // Replace this with real face detection library
        
        const faces = [];
        
        // Simulate face detection with some probability
        if (Math.random() > 0.8) { // 20% chance of detecting a face
            faces.push({
                x: Math.random() * (this.video.videoWidth - 100),
                y: Math.random() * (this.video.videoHeight - 100),
                width: 80 + Math.random() * 40,
                height: 80 + Math.random() * 40
            });
        }
        
        return faces;
    }
    
    stopTracking() {
        this.isTracking = false;
        
        if (this.video.srcObject) {
            this.video.srcObject.getTracks().forEach(track => track.stop());
            this.video.srcObject = null;
        }
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Clear face tracker
        this.faceTracker.clear();
        
        this.startBtn.disabled = false;
        this.stopBtn.disabled = true;
        this.status.textContent = 'Tracking stopped';
    }
}

// Initialize the face tracker when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new FaceTracker();
});
