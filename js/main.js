document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu elements
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navOverlay = document.querySelector('.nav-overlay');
    const body = document.body;
    const html = document.documentElement;
    const menuItems = document.querySelectorAll('.nav-links a');
    const firstMenuItem = menuItems[0];
    const lastMenuItem = menuItems[menuItems.length - 1];

    if (mobileMenuToggle && navLinks) {
        // Initialize ARIA attributes
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.setAttribute('aria-controls', 'mobile-menu');
        navLinks.setAttribute('aria-hidden', 'true');

        // Toggle menu function
        const toggleMenu = (show = null) => {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            const shouldShow = show !== null ? show : !isExpanded;
            
            // Toggle classes
            mobileMenuToggle.classList.toggle('active', shouldShow);
            navLinks.classList.toggle('active', shouldShow);
            navOverlay.classList.toggle('active', shouldShow);
            
            // Toggle body scroll and ARIA attributes
            if (shouldShow) {
                body.style.overflow = 'hidden';
                html.style.overflow = 'hidden';
                mobileMenuToggle.setAttribute('aria-expanded', 'true');
                navLinks.setAttribute('aria-hidden', 'false');
                body.classList.add('menu-open');
                
                // Set focus to first menu item when opening
                setTimeout(() => {
                    firstMenuItem.focus();
                }, 100);
            } else {
                body.style.overflow = '';
                html.style.overflow = '';
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                navLinks.setAttribute('aria-hidden', 'true');
                body.classList.remove('menu-open');
                
                // Return focus to menu button when closing
                mobileMenuToggle.focus();
            }
            
            // Toggle menu button text
            const menuText = mobileMenuToggle.querySelector('.menu-text');
            if (menuText) {
                menuText.textContent = shouldShow ? 'Close' : 'Menu';
            }
        };

        // Toggle menu on button click
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            toggleMenu();
        });

        // Close menu when clicking overlay
        navOverlay.addEventListener('click', () => {
            toggleMenu(false);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileMenuToggle.classList.contains('active') && 
                !mobileMenuToggle.contains(e.target) && 
                !navLinks.contains(e.target)) {
                toggleMenu(false);
            }
        });

        // Close menu when clicking a link
        menuItems.forEach(link => {
            link.addEventListener('click', () => {
                toggleMenu(false);
            });
        });

        // Handle keyboard navigation
        mobileMenuToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            } else if (e.key === 'Escape' && mobileMenuToggle.classList.contains('active')) {
                toggleMenu(false);
            }
        });

        // Trap focus inside the menu when open
        navLinks.addEventListener('keydown', (e) => {
            if (!mobileMenuToggle.classList.contains('active')) return;

            const isTabPressed = e.key === 'Tab' || e.keyCode === 9;

            if (!isTabPressed) return;

            if (e.shiftKey) {
                if (document.activeElement === firstMenuItem) {
                    e.preventDefault();
                    lastMenuItem.focus();
                }
            } else {
                if (document.activeElement === lastMenuItem) {
                    e.preventDefault();
                    firstMenuItem.focus();
                }
            }
        });

        // Close menu on window resize if it becomes desktop view
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 768) {
                    toggleMenu(false);
                }
            }, 100);
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Close mobile menu after clicking a link
                if (mobileNavToggle) {
                    mobileNavToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                    mobileNavToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    // Active link highlighting
    const sections = document.querySelectorAll('section');
    const navLinkItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 300)) {
                current = section.getAttribute('id');
            }
        });

        navLinkItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Load skills from database
    function loadSkills() {
        fetch('includes/fetch_data.php?action=get_skills')
            .then(response => response.json())
            .then(skills => {
                const skillsContainer = document.getElementById('skills-container');
                if (skillsContainer && skills.length > 0) {
                    skillsContainer.innerHTML = skills.map(skill => `
                        <div class="skill-item">
                            <i class="${skill.icon}"></i>
                            <h3>${skill.name}</h3>
                            <span>${skill.category}</span>
                        </div>
                    `).join('');
                }
            })
            .catch(error => console.error('Error loading skills:', error));
    }

    // Load projects from database
    function loadProjects() {
        fetch('includes/fetch_data.php?action=get_projects')
            .then(response => response.json())
            .then(projects => {
                const projectsContainer = document.getElementById('projects-container');
                if (projectsContainer && projects.length > 0) {
                    projectsContainer.innerHTML = projects.map(project => `
                        <div class="project-card">
                            <img src="${project.image_url || 'img/placeholder.jpg'}" alt="${project.title}" class="project-image">
                            <div class="project-info">
                                <h3>${project.title}</h3>
                                <p>${project.description}</p>
                                <div class="project-links">
                                    ${project.project_url ? `<a href="${project.project_url}" target="_blank"><i class="fas fa-external-link-alt"></i> View Project</a>` : ''}
                                    ${project.github_url ? `<a href="${project.github_url}" target="_blank"><i class="fab fa-github"></i> GitHub</a>` : ''}
                                </div>
                            </div>
                        </div>
                    `).join('');
                }
            })
            .catch(error => console.error('Error loading projects:', error));
    }

    // Form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            
            fetch('submit_contact.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Message sent successfully!');
                    contactForm.reset();
                } else {
                    alert(data.message || 'Error sending message. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again later.');
            });
        });
    }

    // Load data when page loads
    loadSkills();
    loadProjects();
});
