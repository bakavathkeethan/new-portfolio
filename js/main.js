document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (mobileNavToggle && navLinks) {
        // Initialize aria-expanded attribute
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        mobileNavToggle.setAttribute('aria-label', 'Toggle navigation menu');

        const toggleMenu = (show = null) => {
            const shouldShow = show !== null ? show : !mobileNavToggle.classList.contains('active');
            
            mobileNavToggle.classList.toggle('active', shouldShow);
            navLinks.classList.toggle('active', shouldShow);
            body.style.overflow = shouldShow ? 'hidden' : '';
            
            // Toggle aria-expanded attribute
            mobileNavToggle.setAttribute('aria-expanded', shouldShow ? 'true' : 'false');
            
            // Add/remove no-scroll class to body
            if (shouldShow) {
                body.classList.add('menu-open');
            } else {
                body.classList.remove('menu-open');
            }
        };

        // Toggle menu on button click
        mobileNavToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileNavToggle.classList.contains('active') && 
                !mobileNavToggle.contains(e.target) && 
                !navLinks.contains(e.target)) {
                toggleMenu(false);
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                toggleMenu(false);
            });
        });

        // Handle keyboard navigation
        mobileNavToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            } else if (e.key === 'Escape' && mobileNavToggle.classList.contains('active')) {
                toggleMenu(false);
                mobileNavToggle.focus();
            }
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
