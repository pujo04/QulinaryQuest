const About = {
  async render() {
    return `
      <div class="about-container" style="max-width: 1200px; margin: 0 auto; padding: 40px 20px 80px;">
        
        <!-- About Hero Section -->
        <div class="about-hero" style="position: relative; border-radius: 16px; overflow: hidden; margin-bottom: 60px; box-shadow: 0 16px 36px rgba(0, 0, 0, 0.15);">
          <div style="width: 100%; height: 400px; background: #0f141c;">
            <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80" 
                 alt="CulinaryQuest Vision" 
                 style="width: 100%; height: 100%; object-fit: cover; opacity: 0.8;">
          </div>
          <div style="position: absolute; inset: 0; background: linear-gradient(0deg, rgba(13,17,23,0.9) 0%, rgba(13,17,23,0.4) 50%, transparent 100%); display: flex; flex-direction: column; justify-content: flex-end; padding: 40px;">
            <span style="color: var(--accent-amber); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.85rem; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px;">Our Story</span>
            <h2 style="font-family: 'Playfair Display', serif; font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 700; color: #fff; margin: 0; line-height: 1.1;">Elevating the Art <br><span style="color: var(--accent-amber); font-style: italic;">of Dining</span></h2>
          </div>
        </div>

        <!-- Editorial Content 2-Column -->
        <div class="about-editorial-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; margin-bottom: 60px;">
          <div class="editorial-card" style="background: var(--pure-white); padding: 40px; border-radius: 14px; border: 1px solid var(--border-subtle); box-shadow: 0 6px 20px rgba(0,0,0,0.03);">
            <h3 style="font-family: 'Playfair Display', serif; font-size: 1.8rem; color: var(--primary-dark); margin-bottom: 20px;">Filosofi Kami</h3>
            <p style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.05rem; color: var(--text-light); line-height: 1.8; margin-bottom: 16px;">
              Di CulinaryQuest, kami percaya bahwa makan malam bukan sekadar tentang makanan, melainkan simfoni dari rasa, suasana, dan pelayanan. Kami mengkurasi destinasi kuliner terbaik untuk mereka yang menghargai keindahan dalam setiap gigitan.
            </p>
            <p style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.05rem; color: var(--text-light); line-height: 1.8;">
              Misi kami adalah menjembatani jarak antara pencinta kuliner dan mahakarya gastronomi tersembunyi di sudut kota, menghadirkan ulasan jujur dengan standar editorial kelas dunia.
            </p>
          </div>

          <div class="editorial-card" style="background: var(--pure-white); padding: 40px; border-radius: 14px; border: 1px solid var(--border-subtle); box-shadow: 0 6px 20px rgba(0,0,0,0.03);">
            <h3 style="font-family: 'Playfair Display', serif; font-size: 1.8rem; color: var(--primary-dark); margin-bottom: 20px;">Visi Kuliner</h3>
            <p style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.05rem; color: var(--text-light); line-height: 1.8; margin-bottom: 16px;">
              Menjadi katalog referensi kuliner premium yang paling dipercaya. Kami merancang platform ini secara khusus untuk merepresentasikan keindahan cita rasa dan kenyamanan dari dunia fine dining serta kafe berkualitas.
            </p>
            <p style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.05rem; color: var(--text-light); line-height: 1.8;">
              Setiap restoran yang tampil di sini telah melalui proses seleksi ketat untuk memastikan Anda hanya mendapatkan pengalaman bersantap yang tak terlupakan.
            </p>
          </div>
        </div>

        <!-- The Creator Section -->
        <div class="creator-section" style="text-align: center; max-width: 680px; margin: 0 auto; background: var(--primary-dark); padding: 50px 36px; border-radius: 16px; color: var(--surface-cream); box-shadow: 0 16px 36px rgba(0,0,0,0.18);">
          <span style="color: var(--accent-amber); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.8rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px; display: block;">The Creator</span>
          <h3 style="font-family: 'Playfair Display', serif; font-size: 2.2rem; margin-bottom: 8px; font-weight: 700; color: var(--surface-cream);">Andreas Pujo S.</h3>
          <p style="color: var(--accent-amber); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.95rem; font-weight: 600; margin-bottom: 20px; letter-spacing: 0.5px;">Front-End Web Developer & UI/UX Specialist</p>
         
          <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
            <a href="https://github.com/pujo04" target="_blank" rel="noopener noreferrer" 
               style="display: inline-flex; align-items: center; gap: 8px; padding: 11px 24px; background: var(--accent-amber); color: var(--primary-dark); font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 0.92rem; border-radius: 8px; text-decoration: none; transition: all 0.3s ease;"
               onmouseover="this.style.background='var(--accent-amber-hover)'; this.style.transform='translateY(-2px)';"
               onmouseout="this.style.background='var(--accent-amber)'; this.style.transform='translateY(0)';">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              <span>GitHub</span>
            </a>
            <a href="https://www.linkedin.com/in/andreaspujos/" target="_blank" rel="noopener noreferrer" 
               style="display: inline-flex; align-items: center; gap: 8px; padding: 11px 24px; background: rgba(255,255,255,0.08); color: var(--surface-cream); border: 1px solid rgba(255,255,255,0.2); font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; font-size: 0.92rem; border-radius: 8px; text-decoration: none; transition: all 0.3s ease;"
               onmouseover="this.style.background='rgba(255,255,255,0.16)'; this.style.transform='translateY(-2px)';"
               onmouseout="this.style.background='rgba(255,255,255,0.08)'; this.style.transform='translateY(0)';">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.763z"/></svg>
              <span>LinkedIn</span>
            </a>
          </div>
        </div>

      </div>
    `;
  },

  async afterRender() {
    const elements = document.querySelectorAll('.editorial-card, .creator-section');
    elements.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      setTimeout(() => {
        el.style.transition = 'all 0.8s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, (i + 1) * 200);
    });
  },
};

export default About;
