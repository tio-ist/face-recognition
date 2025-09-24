# Live Face Tracker with Persistent Turkish Adjectives (ASCII-Compatible)

A real-time face detection application that marks detected faces with red bounding boxes and displays persistent Turkish adjectives above each person's head. **The same person keeps the same adjective until they leave the room!**

## 🎯 Key Features

- **Persistent Face Tracking**: Same person keeps the same Turkish adjective until they leave
- **ASCII-Compatible**: No special Turkish characters (ş, ğ, ü, ö, ç, ı) - displays perfectly in OpenCV
- **Red Bounding Boxes**: Marks all detected faces with red rectangles
- **Smart Face Recognition**: Tracks individual people across frames
- **6-Hour Operation**: Optimized for continuous 6-hour operation without crashes
- **Memory Management**: Automatic memory cleanup and garbage collection
- **Performance Monitoring**: Real-time FPS and runtime display
- **Camera & Video Support**: Works with live camera or video files

## 🔄 How Face Tracking Works

1. **New Person Enters**: Gets assigned a random Turkish adjective
2. **Person Moves**: Same adjective follows them around
3. **Person Leaves**: Adjective is removed when they're gone for 30+ frames
4. **Person Returns**: Gets a NEW random adjective (fresh start)

## ASCII-Compatible Turkish Adjectives

The app uses ASCII-compatible Turkish adjectives (no special characters):
- tatli (sweet/cute) - instead of "tatlı"
- mutlu (happy)
- sarhos (drunk) - instead of "sarhoş"
- guzel (beautiful) - instead of "güzel"
- yakisikli (handsome) - instead of "yakışıklı"
- sirin (cute) - instead of "şirin"
- neseli (cheerful) - instead of "neşeli"
- uzgun (sad) - instead of "üzgün"
- yorgun (tired)
- enerjik (energetic)
- sakin (calm)
- heyecanli (excited) - instead of "heyecanlı"
- kizgin (angry) - instead of "kızgın"
- saskin (surprised) - instead of "şaşkın"
- gururlu (proud)
- utangac (shy) - instead of "utangaç"
- cesur (brave)
- korkak (cowardly)
- akilli (smart) - instead of "akıllı"
- aptal (stupid)
- comert (generous) - instead of "cömert"
- cimri (stingy)
- dostane (friendly)
- dusmanca (hostile) - instead of "düşmanca"
- sicak (warm) - instead of "sıcak"
- soguk (cold) - instead of "soğuk"
- genc (young) - instead of "genç"
- yasli (old) - instead of "yaşlı"
- guclu (strong) - instead of "güçlü"
- zayif (weak)
- komik (funny)
- ciddi (serious)
- rahat (relaxed)
- gergin (tense)
- ozguvenli (confident) - instead of "özgüvenli"
- cekingen (timid) - instead of "çekingen"
- sosyal (social)
- sevimli (lovely)
- kibar (polite)
- nazik (gentle)
- sert (hard)
- yumusak (soft) - instead of "yumuşak"
- hizli (fast) - instead of "hızlı"
- yavas (slow) - instead of "yavaş"
- buyuk (big) - instead of "büyük"
- kucuk (small) - instead of "küçük"
- uzun (long)
- kisa (short) - instead of "kısa"
- kalin (thick) - instead of "kalın"
- ince (thin)
- genis (wide) - instead of "geniş"
- dar (narrow)

## Installation

1. Make sure you have Python 3 installed
2. Run the setup script:
   ```bash
   ./run_ascii_tracker.sh
   ```

## Usage

### Quick Start (Camera) - RECOMMENDED
```bash
./run_ascii_tracker.sh
```

### Manual Start (Camera)
```bash
source venv/bin/activate
python3 face_tracker_ascii.py
```

### Using Video File
```bash
source venv/bin/activate
python3 face_tracker_ascii.py --video path/to/your/video.mp4
```

### Help
```bash
python3 face_tracker_ascii.py --help
```

## Camera Permission (macOS)

If you get "camera failed to properly initialize" error:

1. **Grant Camera Permission**:
   - Go to System Preferences → Security & Privacy → Privacy → Camera
   - Add Terminal (or your IDE) to the list of allowed applications
   - Restart Terminal and try again

2. **Alternative**: Use a video file instead:
   ```bash
   python3 face_tracker_ascii.py --video your_video.mp4
   ```

## Controls

- **'q' key**: Quit the application
- **Ctrl+C**: Force quit

## Technical Details

### Face Tracking Algorithm
- **Distance-based matching**: Faces within 100 pixels are considered the same person
- **Position history**: Tracks last 5 positions for smooth tracking
- **Absence detection**: Removes face after 30 frames (1 second) of absence
- **Unique IDs**: Each face gets a unique identifier for consistent tracking

### ASCII Compatibility
- **No Special Characters**: All Turkish adjectives use ASCII characters only
- **OpenCV Compatible**: Displays perfectly in OpenCV text rendering
- **Cross-Platform**: Works on all systems without encoding issues

### Performance Optimizations
- Limited concurrent face tracking (max 20 faces)
- Automatic memory cleanup every 10 seconds
- Garbage collection when memory usage exceeds 500MB
- Auto-restart every 2 hours to prevent memory leaks
- Reduced camera buffer size for lower latency

### System Requirements
- Python 3.7+
- OpenCV 4.8+
- Webcam or camera device (or video file)
- Minimum 4GB RAM recommended

### Memory Management
The application includes several memory management features:
- Automatic cleanup of old face labels
- Memory usage monitoring
- Garbage collection triggers
- Auto-restart mechanism

## Troubleshooting

### Camera Issues
If the camera is not detected:
1. **Grant camera permission** (see Camera Permission section above)
2. Check if your camera is connected and working
3. Make sure no other applications are using the camera
4. Try using a video file instead: `python3 face_tracker_ascii.py --video test_video.mp4`

### Face Tracking Issues
If faces are getting new labels too often:
1. The tracking distance might be too small for your camera setup
2. Try adjusting the `max_distance` parameter in the code
3. Ensure good lighting for better face detection

### Performance Issues
If the application runs slowly:
1. Close other applications to free up memory
2. Reduce the camera resolution in the code
3. Increase the detection confidence threshold

### Memory Issues
If you experience memory problems:
1. The app will automatically restart every 2 hours
2. Monitor the memory usage display in the status bar
3. The app includes automatic garbage collection

## File Structure

```
face-recognition/
├── face_tracker_ascii.py        # ASCII-compatible face tracker (RECOMMENDED)
├── face_tracker_persistent.py   # Unicode version (may have display issues)
├── face_tracker_opencv.py       # Basic OpenCV face tracker
├── face_tracker_with_video.py   # Version with video file support
├── run_ascii_tracker.sh         # Startup script for ASCII tracker
├── requirements.txt             # Python dependencies
├── venv/                        # Virtual environment
└── README.md                    # This file
```

## Examples

### Test with Video File
```bash
# Download a test video with faces
curl -o test_video.mp4 "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"

# Run ASCII face tracker on video
python3 face_tracker_ascii.py --video test_video.mp4
```

### Camera Mode (ASCII-Compatible)
```bash
# Run with live camera and ASCII-compatible tracking
python3 face_tracker_ascii.py
```

## How It Works

1. **Face Detection**: OpenCV detects all faces in the frame
2. **Face Matching**: New detections are matched with existing tracked faces
3. **Distance Calculation**: Faces within 100 pixels are considered the same person
4. **Label Persistence**: Same person keeps their Turkish adjective
5. **Cleanup**: Faces absent for 30+ frames are removed from tracking

## License

This project is open source and available under the MIT License.
