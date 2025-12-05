if ('startViewTransition' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        const links = document.querySelectorAll('a[href]');

        links.forEach(link => {
            const href = link.getAttribute('href');

            if (href &&
                href.endsWith('.html') &&
                !href.startsWith('http') &&
                !href.startsWith('//') &&
                !link.hasAttribute('target')) {

                link.addEventListener('click', function(e) {
                    e.preventDefault();

                    if (!document.startViewTransition) {
                        window.location.href = href;
                        return;
                    }

                    document.startViewTransition(async () => {
                        const response = await fetch(href);
                        const html = await response.text();
                        const parser = new DOMParser();
                        const newDoc = parser.parseFromString(html, 'text/html');

                        document.body.innerHTML = newDoc.body.innerHTML;
                        document.title = newDoc.title;

                        const newScripts = newDoc.querySelectorAll('script');
                        newScripts.forEach(script => {
                            if (script.src) {
                                const newScript = document.createElement('script');
                                newScript.src = script.src;
                                if (script.defer) newScript.defer = true;
                                document.body.appendChild(newScript);
                            } else if (script.textContent) {
                                const newScript = document.createElement('script');
                                newScript.textContent = script.textContent;
                                document.body.appendChild(newScript);
                            }
                        });

                        window.history.pushState({}, '', href);
                    });
                });
            }
        });

        window.addEventListener('popstate', () => {
            if (document.startViewTransition) {
                document.startViewTransition(() => {
                    window.location.reload();
                });
            } else {
                window.location.reload();
            }
        });
    });
}
