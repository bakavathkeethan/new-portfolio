document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileNavToggle && navLinks) {
        // Initialize aria-expanded attribute
        mobileNavToggle.setAttribute('aria-expanded', 'false');

        mobileNavToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent click from bubbling up
            mobileNavToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Toggle aria-expanded attribute
            const expanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            mobileNavToggle.setAttribute('aria-expanded', !expanded);
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileNavToggle.classList.contains('active') && 
                !mobileNavToggle.contains(e.target) && 
                !navLinks.contains(e.target)) {
                mobileNavToggle.classList.remove('active');
                navLinks.classList.remove('active');
                mobileNavToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close mobile menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.stopPropagation();
                mobileNavToggle.classList.remove('active');
                navLinks.classList.remove('active');
                mobileNavToggle.setAttribute('aria-expanded', 'false');
            });
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
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 300)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
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
