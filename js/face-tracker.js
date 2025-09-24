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
        this.faceTracker = new Map(); // face_id -> {label, lastSeen, position}
        this.faceIdCounter = 0;
        this.maxDistance = 100;
        this.maxAbsentTime = 2000; // 2 seconds
        
        // MediaPipe
        this.faceDetection = null;
        this.camera = null;
        this.isTracking = false;
        
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
    
    onResults(results) {
        if (!this.isTracking) return;
        
        // Update canvas size to match video
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        
        if (results.detections && results.detections.length > 0) {
            // Convert MediaPipe detections to our format
            const detectedFaces = results.detections.map(detection => {
                const bbox = detection.locationData.relativeBoundingBox;
                return {
                    x: bbox.xLeft * this.video.videoWidth,
                    y: bbox.yTop * this.video.videoHeight,
                    width: bbox.width * this.video.videoWidth,
                    height: bbox.height * this.video.videoHeight
                };
            });
            
            // Update face tracking
            this.updateFaceTracking(detectedFaces);
        }
        
        // Draw annotations
        this.drawAnnotations();
        
        // Update status
        this.status.textContent = `Tracking ${this.faceTracker.size} faces`;
    }
    
    async startTracking() {
        try {
            this.status.textContent = 'Starting camera...';
            
            // Initialize MediaPipe Face Detection
            this.faceDetection = new FaceDetection({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`;
                }
            });
            
            this.faceDetection.setOptions({
                model: 'short',
                minDetectionConfidence: 0.5
            });
            
            this.faceDetection.onResults((results) => this.onResults(results));
            
            // Start camera
            this.camera = new Camera(this.video, {
                onFrame: async () => {
                    if (this.isTracking) {
                        await this.faceDetection.send({ image: this.video });
                    }
                },
                width: 640,
                height: 480
            });
            
            await this.camera.start();
            
            this.isTracking = true;
            this.startBtn.disabled = true;
            this.stopBtn.disabled = false;
            this.status.textContent = 'Face tracking started!';
            
        } catch (error) {
            console.error('Error starting tracking:', error);
            this.status.textContent = 'Error starting camera. Please check permissions.';
        }
    }
    
    stopTracking() {
        this.isTracking = false;
        
        if (this.camera) {
            this.camera.stop();
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
