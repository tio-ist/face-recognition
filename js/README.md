# Web Face Tracker - Turkish Adjectives

A web-based face detection application that marks detected faces with red bounding boxes and displays persistent Turkish adjectives above each person's head.

## 🎯 Features

- **Live Face Detection**: Uses MediaPipe for accurate face detection
- **Red Bounding Boxes**: Marks all detected faces with red rectangles
- **Persistent Turkish Adjectives**: Same person keeps same label until they leave
- **Real-time Tracking**: Works in any modern web browser
- **No Installation Required**: Just open the HTML file

## 🚀 How to Use

### Option 1: Direct File Opening
1. Open `index.html` in your web browser
2. Click "Start Tracking" button
3. Allow camera permissions when prompted
4. See faces detected with Turkish adjectives!

### Option 2: Local Server (Recommended)
```bash
# Using Python's built-in server
cd js
python3 -m http.server 8000

# Then open: http://localhost:8000
```

### Option 3: Using Node.js
```bash
# Install a simple server
npm install -g http-server

# Start server
cd js
http-server

# Then open: http://localhost:8080
```

## 📱 Browser Requirements

- **Chrome/Edge**: Best support for MediaPipe
- **Firefox**: Good support
- **Safari**: Basic support
- **Mobile**: Works on modern mobile browsers

## 🎨 Turkish Adjectives Used

The app randomly assigns one of these Turkish adjectives to each detected face:
- tatli (sweet/cute)
- mutlu (happy)
- sarhos (drunk)
- guzel (beautiful)
- yakisikli (handsome)
- sirin (cute)
- neseli (cheerful)
- uzgun (sad)
- yorgun (tired)
- enerjik (energetic)
- sakin (calm)
- heyecanli (excited)
- kizgin (angry)
- saskin (surprised)
- gururlu (proud)
- utangac (shy)
- cesur (brave)
- korkak (cowardly)
- akilli (smart)
- aptal (stupid)
- comert (generous)
- cimri (stingy)
- dostane (friendly)
- dusmanca (hostile)
- sicak (warm)
- soguk (cold)
- genc (young)
- yasli (old)
- guclu (strong)
- zayif (weak)
- komik (funny)
- ciddi (serious)
- rahat (relaxed)
- gergin (tense)
- ozguvenli (confident)
- cekingen (timid)
- sosyal (social)

## 🔧 How It Works

1. **Face Detection**: MediaPipe detects all faces in the video stream
2. **Face Matching**: New detections are matched with existing tracked faces
3. **Distance Calculation**: Faces within 100 pixels are considered the same person
4. **Label Persistence**: Same person keeps their Turkish adjective
5. **Cleanup**: Faces absent for 2+ seconds are removed from tracking

## 📁 File Structure

```
js/
├── index.html          # Main HTML file
├── face-tracker.js     # JavaScript face tracking logic
└── README.md           # This file
```

## 🚨 Troubleshooting

### Camera Permission Issues
- Make sure to allow camera access when prompted
- Check browser settings for camera permissions
- Try refreshing the page if camera doesn't start

### Performance Issues
- Close other applications using the camera
- Use a modern browser (Chrome/Edge recommended)
- Ensure good lighting for better face detection

### MediaPipe Loading Issues
- Check internet connection (MediaPipe loads from CDN)
- Try refreshing the page
- Use a modern browser with WebGL support

## 🎯 Controls

- **Start Tracking**: Begin face detection
- **Stop Tracking**: Stop face detection
- **Camera**: Automatically starts when you click "Start Tracking"

## 📱 Mobile Support

The web version works on mobile devices:
- iOS Safari: Good support
- Android Chrome: Excellent support
- Mobile Firefox: Good support

## 🔒 Privacy

- All processing happens locally in your browser
- No data is sent to external servers
- Camera feed is not recorded or stored
- MediaPipe models are loaded from CDN but run locally

## 🆚 Web vs Python Version

| Feature | Web Version | Python Version |
|---------|-------------|----------------|
| Installation | None required | Python + dependencies |
| Performance | Good | Excellent |
| Offline | Requires internet for MediaPipe | Fully offline |
| Mobile | Works on mobile | Desktop only |
| Setup | Just open HTML | Install Python packages |

## License

This project is open source and available under the MIT License.
