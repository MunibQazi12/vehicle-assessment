# HTML Block Examples

This file contains practical examples of HTML code that can be pasted into the HTML Block in Payload CMS.

## 1. Alert Banner

```html
<div style="
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
">
  <h2 style="margin: 0 0 0.5rem 0; font-size: 1.5rem;">Limited Time Offer!</h2>
  <p style="margin: 0; font-size: 1.1rem;">Get 20% off all vehicles this weekend only</p>
</div>
```

## 2. Feature Cards Grid

```html
<style>
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    padding: 2rem 0;
  }
  .feature-card {
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .feature-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
  .feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  .feature-title {
    font-size: 1.25rem;
    font-weight: bold;
    margin: 0 0 0.5rem 0;
  }
  .feature-desc {
    color: #6b7280;
    margin: 0;
  }
</style>

<div class="feature-grid">
  <div class="feature-card">
    <div class="feature-icon">🚗</div>
    <h3 class="feature-title">Wide Selection</h3>
    <p class="feature-desc">Over 500 vehicles in stock</p>
  </div>
  <div class="feature-card">
    <div class="feature-icon">💰</div>
    <h3 class="feature-title">Best Prices</h3>
    <p class="feature-desc">Competitive financing options</p>
  </div>
  <div class="feature-card">
    <div class="feature-icon">⭐</div>
    <h3 class="feature-title">Quality Service</h3>
    <p class="feature-desc">5-star customer reviews</p>
  </div>
</div>
```

## 3. Countdown Timer (Requires JavaScript)

**Note:** Enable "Enable JavaScript" checkbox in block settings.

```html
<style>
  .countdown-container {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    color: white;
  }
  .countdown-title {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
  }
  .countdown-timer {
    display: flex;
    justify-content: center;
    gap: 1rem;
    font-size: 2rem;
    font-weight: bold;
  }
  .time-unit {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 80px;
  }
  .time-value {
    font-size: 3rem;
    line-height: 1;
  }
  .time-label {
    font-size: 0.875rem;
    font-weight: normal;
    opacity: 0.9;
  }
</style>

<div class="countdown-container">
  <h2 class="countdown-title">Sale Ends In:</h2>
  <div class="countdown-timer" id="countdown">
    <div class="time-unit">
      <span class="time-value" id="days">00</span>
      <span class="time-label">Days</span>
    </div>
    <div class="time-unit">
      <span class="time-value" id="hours">00</span>
      <span class="time-label">Hours</span>
    </div>
    <div class="time-unit">
      <span class="time-value" id="minutes">00</span>
      <span class="time-label">Minutes</span>
    </div>
    <div class="time-unit">
      <span class="time-value" id="seconds">00</span>
      <span class="time-label">Seconds</span>
    </div>
  </div>
</div>

<script>
  // Set the end date (change this to your desired date)
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7); // 7 days from now

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = endDate - now;

    if (distance < 0) {
      document.getElementById('countdown').innerHTML = '<p style="margin: 0; font-size: 2rem;">Sale Ended!</p>';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
</script>
```

## 4. Testimonial Slider (Requires JavaScript)

**Note:** Enable "Enable JavaScript" checkbox in block settings.

```html
<style>
  .testimonial-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    background: #f9fafb;
    border-radius: 12px;
  }
  .testimonial {
    display: none;
    text-align: center;
    padding: 2rem;
  }
  .testimonial.active {
    display: block;
    animation: fadeIn 0.5s;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .testimonial-text {
    font-size: 1.25rem;
    font-style: italic;
    color: #374151;
    margin: 0 0 1rem 0;
  }
  .testimonial-author {
    font-weight: bold;
    color: #1f2937;
    margin: 0;
  }
  .testimonial-nav {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1.5rem;
  }
  .nav-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #d1d5db;
    border: none;
    cursor: pointer;
    padding: 0;
  }
  .nav-dot.active {
    background: #3b82f6;
  }
</style>

<div class="testimonial-container">
  <div class="testimonials">
    <div class="testimonial active">
      <p class="testimonial-text">"Best car buying experience I've ever had! The team was professional and helpful."</p>
      <p class="testimonial-author">— John Smith</p>
    </div>
    <div class="testimonial">
      <p class="testimonial-text">"Amazing service and great prices. Highly recommend to anyone looking for a new vehicle."</p>
      <p class="testimonial-author">— Sarah Johnson</p>
    </div>
    <div class="testimonial">
      <p class="testimonial-text">"Found the perfect car and got a fantastic deal. The process was smooth and easy."</p>
      <p class="testimonial-author">— Michael Davis</p>
    </div>
  </div>
  <div class="testimonial-nav" id="nav"></div>
</div>

<script>
  const testimonials = document.querySelectorAll('.testimonial');
  const nav = document.getElementById('nav');
  let currentIndex = 0;

  // Create navigation dots
  testimonials.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = 'nav-dot' + (index === 0 ? ' active' : '');
    dot.onclick = () => goToTestimonial(index);
    nav.appendChild(dot);
  });

  function goToTestimonial(index) {
    testimonials[currentIndex].classList.remove('active');
    nav.children[currentIndex].classList.remove('active');
    currentIndex = index;
    testimonials[currentIndex].classList.add('active');
    nav.children[currentIndex].classList.add('active');
  }

  // Auto-rotate every 5 seconds
  setInterval(() => {
    goToTestimonial((currentIndex + 1) % testimonials.length);
  }, 5000);
</script>
```

## 5. Statistics Bar

```html
<style>
  .stats-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    padding: 3rem 2rem;
    background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
    border-radius: 12px;
    color: white;
  }
  .stat {
    text-align: center;
  }
  .stat-value {
    font-size: 3rem;
    font-weight: bold;
    line-height: 1;
    margin: 0 0 0.5rem 0;
  }
  .stat-label {
    font-size: 1rem;
    opacity: 0.9;
    margin: 0;
  }
</style>

<div class="stats-container">
  <div class="stat">
    <h3 class="stat-value">500+</h3>
    <p class="stat-label">Vehicles in Stock</p>
  </div>
  <div class="stat">
    <h3 class="stat-value">10K+</h3>
    <p class="stat-label">Happy Customers</p>
  </div>
  <div class="stat">
    <h3 class="stat-value">25+</h3>
    <p class="stat-label">Years in Business</p>
  </div>
  <div class="stat">
    <h3 class="stat-value">4.9★</h3>
    <p class="stat-label">Average Rating</p>
  </div>
</div>
```

## 6. Video Embed (YouTube)

```html
<div style="
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  max-width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
">
  <iframe
    style="
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 0;
    "
    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
    title="YouTube video"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen>
  </iframe>
</div>
```

## 7. Image Gallery

```html
<style>
  .gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
    padding: 1rem 0;
  }
  .gallery-item {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    aspect-ratio: 4/3;
    background: #e5e7eb;
  }
  .gallery-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }
  .gallery-item:hover img {
    transform: scale(1.1);
  }
</style>

<div class="gallery">
  <div class="gallery-item">
    <img src="https://placehold.co/400x300/blue/white?text=Car+1" alt="Vehicle 1">
  </div>
  <div class="gallery-item">
    <img src="https://placehold.co/400x300/green/white?text=Car+2" alt="Vehicle 2">
  </div>
  <div class="gallery-item">
    <img src="https://placehold.co/400x300/red/white?text=Car+3" alt="Vehicle 3">
  </div>
  <div class="gallery-item">
    <img src="https://placehold.co/400x300/purple/white?text=Car+4" alt="Vehicle 4">
  </div>
</div>
```

## Tips

1. **Responsive Design**: Use CSS Grid with `auto-fit`/`auto-fill` or Flexbox for responsive layouts
2. **Colors**: Match your dealership's brand colors in the gradients and backgrounds
3. **Accessibility**: Always include alt text for images and proper heading hierarchy
4. **Performance**: Lazy load images with `loading="lazy"` attribute
5. **Testing**: Preview on multiple screen sizes before publishing

## Common Use Cases

- Special promotions and sales banners
- Event countdowns
- Customer testimonials
- Service department features
- Embedded videos and media
- Custom form styling
- Third-party widget integration (chat, reviews, etc.)
