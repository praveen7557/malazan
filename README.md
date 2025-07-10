# 🍺 The Phoenix Inn - Malazan Games

Welcome to **The Phoenix Inn**, an interactive web application featuring games and quizzes based on Steven Erikson's epic fantasy series, *The Malazan Book of the Fallen*. Just like the legendary tavern in Darujhistan, this is a place where fans gather to explore the rich world of Malazan.

## 🎮 Features

### Interactive Games & Quizzes
- **Character Quiz** - Discover which Malazan character matches your personality
- **Deck of Dragons** - Draw mystical cards to reveal your fate
- **Quote Match** - Test your knowledge of memorable Malazan quotes
- **Faction Map** - Explore the major factions across the series
- **Timeline** - Navigate through key events chronologically
- **Duel Arena** - Pit legendary characters against each other in epic battles

### Technical Features
- ⚡ **Vite + React + TypeScript** - Modern development stack
- 🎨 **Tailwind CSS** - Beautiful, responsive design
- 🌙 **Dark Mode** - Full dark/light theme support
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🎭 **Framer Motion** - Smooth animations and transitions
- 🔍 **Full SEO Support** - Optimized for search engines
- 🚀 **Netlify Ready** - Includes routing and deployment config

## 🚀 Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd malazan

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
malazan/
├── public/
│   ├── data/           # JSON data files
│   ├── _redirects      # Netlify routing config
│   ├── sitemap.xml     # SEO sitemap
│   ├── robots.txt      # Search engine instructions
│   └── manifest.json   # PWA manifest
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Main page components
│   ├── contexts/       # React contexts (Theme)
│   ├── utils/          # Utility functions
│   └── App.tsx         # Main app component
└── SEO files and config
```

## 🔍 SEO Configuration

This project includes comprehensive SEO support:

### Meta Tags
- **Primary meta tags** - Title, description, keywords
- **Open Graph** - Facebook/social media sharing
- **Twitter Cards** - Twitter sharing optimization
- **Canonical URLs** - Prevent duplicate content issues

### Technical SEO
- **Sitemap.xml** - Search engine site structure
- **Robots.txt** - Crawling instructions
- **Structured Data** - Rich snippets for search results
- **PWA Manifest** - Progressive web app support

### Setup Instructions

1. **Update Domain URLs**: Replace `https://malazan.netlify.app/` in:
   - `index.html` (canonical URLs, Open Graph)
   - `public/sitemap.xml` (all URL entries)
   - `public/robots.txt` (sitemap URL)
   - `src/components/SEOHead.tsx` (default URLs)

2. **Add Social Media Image**: Create an Open Graph image:
   - Size: 1200x630 pixels
   - Save as `public/og-image.jpg`
   - Update image URLs in meta tags

3. **Customize Meta Tags**: Edit page-specific SEO in:
   - `src/pages/CharacterQuiz.tsx`
   - `src/pages/DuelPage.tsx`
   - Add SEO to other pages as needed

## 📊 Analytics & Tracking

To add analytics, insert tracking codes in `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🌐 Deployment

### Netlify (Recommended)
1. Connect your repository to Netlify
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. The `_redirects` file handles SPA routing automatically

### Other Platforms
- **Vercel**: Works out of the box
- **GitHub Pages**: Requires additional routing setup
- **AWS S3**: Configure CloudFront for SPA routing

## 🎯 SEO Best Practices Implemented

### Technical SEO
- ✅ **Mobile-first responsive design**
- ✅ **Fast loading times** (Vite optimization)
- ✅ **Clean URL structure** (React Router)
- ✅ **Semantic HTML** markup
- ✅ **Proper heading hierarchy** (H1, H2, H3)
- ✅ **Alt text** for images
- ✅ **Meta descriptions** for all pages

### Content SEO
- ✅ **Keyword optimization** for Malazan terms
- ✅ **Long-tail keywords** (character names, book titles)
- ✅ **Content depth** (detailed descriptions)
- ✅ **Internal linking** between pages
- ✅ **Engaging content** (interactive games)

### Performance SEO
- ✅ **Code splitting** (React lazy loading)
- ✅ **Image optimization** (SVG icons)
- ✅ **Minified assets** (Vite production build)
- ✅ **Caching strategies** (Netlify headers)

## 🎨 Customization

### Adding New Games
1. Create a new page component in `src/pages/`
2. Add route to `src/App.tsx`
3. Update navigation in `src/components/Navigation.tsx`
4. Add to sitemap and SEO configuration

### Styling
- **Colors**: Modify `tailwind.config.js`
- **Fonts**: Update font imports in `index.html`
- **Animations**: Customize Framer Motion variants

### Data
- **Characters**: Edit `public/data/characters.json`
- **Quotes**: Edit `public/data/quotes.json`
- **Other data**: Add new JSON files in `public/data/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is for educational and fan purposes. All Malazan content belongs to Steven Erikson and the respective publishers.

## 🙏 Acknowledgments

- **Steven Erikson** - Creator of the Malazan Book of the Fallen series
- **Malazan Community** - For inspiration and feedback
- **Open Source Libraries** - React, Vite, Tailwind CSS, Framer Motion

---

*"First in, Last out"* - The Bridgeburners

Visit **The Phoenix Inn** and discover your place in the Malazan world! 🍺⚔️ 