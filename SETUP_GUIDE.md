# EchoEats - Setup Guide

## New Features

### 1. Google Places API Integration (Location Selector)

The location selector now includes:
- **Address Autocomplete**: Real-time address suggestions as you type
- **Place Search**: Search for any address using Google Places API
- **Saved Addresses**: Locally stored addresses with localStorage
- **Address Details**: Full address information with coordinates
- **📍 Live Location**: Get your current location with one click using Geolocation API

#### Setup Google Places API:

1. **Get API Key**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable "Places API" and "Maps JavaScript API"
   - Create credentials (API Key)
   - Restrict the API key to your domain for security

2. **Add API Key**:
   - Open `/src/app/components/LocationSelector.tsx`
   - Find line with `GOOGLE_MAPS_API_KEY`
   - Replace `'YOUR_GOOGLE_MAPS_API_KEY_HERE'` with your actual API key

```typescript
const GOOGLE_MAPS_API_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
```

3. **Features**:
   - Type to search addresses
   - Autocomplete suggestions appear as you type
   - Click on a suggestion to select
   - Add custom labels (Home, Work, etc.)
   - Delete saved addresses
   - Persistent storage with localStorage

### 2. Web Speech API Integration (Voice Assistant)

The voice assistant now includes:
- **Voice Recognition**: Real speech-to-text using Web Speech API
- **Text-to-Speech**: AI responds with voice
- **Natural Language Processing**: Understands food ordering commands
- **Voice Cart**: Separate cart managed through voice
- **Real-time Updates**: Syncs with main cart

#### Features:

**Voice Commands**:
- "I want chicken biryani" - Orders specific item
- "Add two masala dosa" - Orders with quantity
- "Show me South Indian food" - Browses by category
- "What's for breakfast?" - Gets recommendations
- "Show my cart" - Reviews current order
- "Checkout" or "Place order" - Completes the order

**Browser Support**:
- ✅ Chrome/Edge (recommended)
- ✅ Safari
- ⚠️ Firefox (limited support)

**Permissions Required**:
- Microphone access for voice recognition
- No additional setup needed

### 3. How to Use

#### Location Selector:
1. Click "Deliver to" button in header
2. **Option A - Use Current Location:**
   - Click "Add New Location"
   - Click "Use My Current Location" button
   - Allow location permission when prompted
   - Address will be automatically detected
   - Enter a label and save
3. **Option B - Search Manually:**
   - Click "Add New Location"
   - Enter label (e.g., "Home")
   - Type address in search box
   - Select from autocomplete suggestions
   - Click "Save Location"
4. Select from saved addresses anytime

#### Voice Assistant:
1. Click the microphone button (bottom-right corner)
2. Click the mic icon to start listening (turns red)
3. Speak your order clearly
4. Wait for AI response (spoken + text)
5. Continue conversation to build your order
6. Say "checkout" to complete

### 4. Fallback Behavior

**Without Google API Key**:
- Location selector works with manual address entry
- Autocomplete won't work
- Can still save and manage addresses locally

**Without Microphone**:
- Can still type messages to the voice assistant
- AI will respond with text only (no speech)
- All ordering functionality remains available

### 5. Testing

**Test Voice Commands**:
```
"I want chicken biryani"
"Add three idli"
"Show me desserts"
"What's spicy?"
"Show my cart"
"Checkout"
```

**Test Location**:
- Type partial address
- Should see autocomplete suggestions
- Select and save
- Verify it persists after page reload

### 6. Troubleshooting

**Voice not working?**
- Check browser console for errors
- Ensure HTTPS (required for microphone access)
- Grant microphone permission when prompted
- Try Chrome for best compatibility

**Places API not working?**
- Verify API key is correct
- Check API is enabled in Google Cloud Console
- Verify billing is enabled
- Check browser console for API errors

**Addresses not saving?**
- Check localStorage is enabled
- Clear browser cache and retry
- Check browser console for errors

### 7. Privacy & Security

- **Google Places API**: Only address data sent to Google
- **Voice Data**: Processed locally in browser, not sent to servers
- **Saved Addresses**: Stored locally in browser localStorage
- **No PII Collection**: No personal data sent to external services

### 8. Cost Considerations

**Google Places API Pricing**:
- Autocomplete: $2.83 per 1,000 requests
- Place Details: $17 per 1,000 requests
- Free tier: $200/month credit

**Web Speech API**:
- Completely free
- No API limits
- Built into browser

### 9. Browser Compatibility

| Feature | Chrome | Safari | Firefox | Edge |
|---------|--------|--------|---------|------|
| Voice Recognition | ✅ | ✅ | ⚠️ | ✅ |
| Speech Synthesis | ✅ | ✅ | ✅ | ✅ |
| Places API | ✅ | ✅ | ✅ | ✅ |
| LocalStorage | ✅ | ✅ | ✅ | ✅ |

---

## Quick Start

1. Add your Google Maps API key to `LocationSelector.tsx`
2. Grant microphone permission when prompted
3. Start ordering with voice or text!

For issues or questions, check the browser console for error messages.