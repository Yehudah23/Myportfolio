import { Component, OnInit, HostListener, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit {
  private platformId = inject(PLATFORM_ID);
  darkMode = false;
  isScrolled = false;
  isMenuOpen = false;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    // Check if user has a dark mode preference
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedDarkMode = localStorage.getItem('darkMode');
    
    // Set dark mode based on saved preference or system preference
    if (savedDarkMode !== null) {
      this.darkMode = savedDarkMode === 'true';
    } else {
      this.darkMode = prefersDarkMode;
    }
    
    // Apply dark mode if needed
    if (this.darkMode) {
      this.applyDarkMode();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.isScrolled = window.scrollY > 50;
  }

  toggleDarkMode(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    this.darkMode = !this.darkMode;
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', this.darkMode.toString());
    
    if (this.darkMode) {
      this.applyDarkMode();
    } else {
      this.removeDarkMode();
    }
    
    // Dispatch event for other components
    document.dispatchEvent(new CustomEvent('darkModeChange', { 
      detail: { isDarkMode: this.darkMode } 
    }));
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  scrollTo(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      
      // Close mobile menu after clicking a link
      this.isMenuOpen = false;
    }
  }
  
  private applyDarkMode(): void {
    document.body.classList.add('dark-mode');
    document.documentElement.setAttribute('data-bs-theme', 'dark');
  }
  
  private removeDarkMode(): void {
    document.body.classList.remove('dark-mode');
    document.documentElement.setAttribute('data-bs-theme', 'light');
  }
}
