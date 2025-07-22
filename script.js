
        document.addEventListener('DOMContentLoaded', function () {
            // Theme toggle functionality
            const themeToggle = document.getElementById('themeToggle');
            const body = document.body;
            
            // Check for saved theme preference or use preferred color scheme
            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
                body.setAttribute('data-theme', 'light');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            } else {
                body.setAttribute('data-theme', 'dark');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
            
            themeToggle.addEventListener('click', () => {
                if (body.getAttribute('data-theme') === 'dark') {
                    body.setAttribute('data-theme', 'light');
                    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                    localStorage.setItem('theme', 'light');
                } else {
                    body.setAttribute('data-theme', 'dark');
                    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                    localStorage.setItem('theme', 'dark');
                }
            });

            // Chart time filter buttons
            const timeFilterButtons = document.querySelectorAll('.chart-time-filters button');
            timeFilterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    timeFilterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    updateChart(button.textContent);
                });
            });

            // Valuable items sort buttons
            const valuableSortButtons = document.querySelectorAll('.section-header-actions button');
            valuableSortButtons.forEach(button => {
                button.addEventListener('click', () => {
                    valuableSortButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                });
            });

            // Table filter buttons
            const filterButtons = document.querySelectorAll('.filter-buttons button');
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                });
            });

            // Initialize chart
            function updateChart(range) {
                let days, data;
                switch (range) {
                    case '7D':
                        days = 7;
                        data = generateRandomData(days, 24000, 25000);
                        break;
                    case '30D':
                        days = 30;
                        data = generateRandomData(days, 18000, 25000);
                        break;
                    case '90D':
                        days = 90;
                        data = generateRandomData(days, 15000, 25000);
                        break;
                    case 'YTD':
                        days = 180;
                        data = generateRandomData(days, 10000, 25000);
                        break;
                    case 'All':
                        days = 365;
                        data = generateRandomData(days, 8000, 25000);
                        break;
                }

                const costData = data.marketData.map(value => value * 0.8 + Math.random() * 1000);

                const options = {
                    series: [
                        {
                            name: "Market Value",
                            data: data.marketData
                        },
                        {
                            name: "Cost Value",
                            data: costData
                        }
                    ],
                    chart: {
                        height: 300,
                        type: 'area',
                        toolbar: {
                            show: false
                        },
                        animations: {
                            enabled: true,
                            easing: 'easeinout',
                            speed: 800
                        }
                    },
                    colors: ['#6366f1', '#f43f5e'],
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        curve: 'smooth',
                        width: 2
                    },
                    fill: {
                        type: 'gradient',
                        gradient: {
                            shadeIntensity: 1,
                            opacityFrom: 0.7,
                            opacityTo: 0.3,
                            stops: [0, 90, 100]
                        }
                    },
                    xaxis: {
                        categories: data.dates,
                        labels: {
                            style: {
                                colors: '#94a3b8'
                            }
                        },
                        axisBorder: {
                            show: false
                        }
                    },
                    yaxis: {
                        labels: {
                            style: {
                                colors: '#94a3b8'
                            },
                            formatter: function (value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    tooltip: {
                        theme: body.getAttribute('data-theme'),
                        y: {
                            formatter: function (value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    legend: {
                        labels: {
                            colors: '#f8fafc'
                        }
                    },
                    grid: {
                        borderColor: '#1e293b',
                        strokeDashArray: 4
                    }
                };

                // Destroy previous chart if exists
                if (window.valueChart) {
                    window.valueChart.destroy();
                }
                
                // Create new chart
                window.valueChart = new ApexCharts(document.querySelector("#valueChart"), options);
                window.valueChart.render();
            }

            function generateRandomData(days, min, max) {
                const marketData = [];
                const dates = [];
                const today = new Date();

                for (let i = days; i >= 0; i--) {
                    const date = new Date(today);
                    date.setDate(date.getDate() - i);
                    dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

                    const previousValue = marketData.length > 0 ? marketData[marketData.length - 1] : (min + max) / 2;
                    const randomChange = (Math.random() - 0.3) * 0.02 * previousValue;
                    let newValue = previousValue + randomChange;

                    newValue = Math.max(min, Math.min(max, newValue));
                    marketData.push(Math.round(newValue));
                }

                return { marketData, dates };
            }

            // Initial chart render
            updateChart('7D');

            // Fade in animations
            const animatedElements = document.querySelectorAll('.fade-in');
            animatedElements.forEach((element, index) => {
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 100);
            });
        });
    