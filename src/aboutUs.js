import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const aboutus = () =>{
    return(
        <div className="aboutus-page">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Nunito+Sans:wght@300;400;600;700&display=swap');
                :root {
                    --ink: #12110e;
                    --muted: #4e4a45;
                    --paper: #f7f4ef;
                    --accent: #c2562d;
                    --gold: #f5b32c;
                    --sage: #7a907e;
                    --sun: #f2c400;
                    --rose: #d94b60;
                    --rose-dark: #b12e45;
                    --shadow: 0 24px 60px rgba(18, 17, 14, 0.12);
                }

                *{
                    box-sizing: border-box;
                    margin: 0px;
                    padding: 0px;
                    font-family: 'Nunito Sans', 'Segoe UI', sans-serif;
                }

                .about{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 90vh;
                    margin: 0;
                    background:
                            radial-gradient(circle at 10% 10%, rgba(217, 75, 96, 0.08), transparent 45%),
                            radial-gradient(circle at 85% 20%, rgba(122, 144, 126, 0.1), transparent 50%),
                            linear-gradient(180deg, #faf8f5 0%, #f7f4ef 50%, #ffffff 100%);
                }

                .hero{
                    position: absolute;
                    left: 25px;
                }
                .hero h2{
                    font-size: 4rem;
                    font-family: 'Cormorant Garamond', serif;
                }

                .hero p{
                    font-size: 1.0625rem;
                    width: 500px;
                }

                .gradient-bar {
                width: 100%;
                height: 7px;
                background: linear-gradient(90deg, #6d0b6f 0%, #aa1f6b 35%, #ff4b4b 60%, #f8c21b 100%);

                /* Suaviza el efecto como en la imagen */
                filter: blur(0.5px);
                }

                .values{
                    margin-top: 20px;
                    justify-content: center;
                    text-align: center;
                }

                .card h3{
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 2.5rem;
                    margin-top: 15px;
                    margin-bottom: 15px;
                }

                .card p{
                    font-size: 1.25rem;
                }

                .team{
                    margin-top: 60px;
                }

                .team h2{
                    text-align: center;
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 2.5rem;
                }

                .team-members {
                    display: flex;
                    gap: 20px;
                    margin-top: 20px;
                    flex-wrap: wrap;
                }

                .member {
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    flex: 1;
                    text-align: center;
                    width: 100px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                }

                .member h4 {
                    margin-bottom: 5px;
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 2.5rem;
                }

                .member span {
                    color: #777;
                    font-size: 0.9rem;
                }
                `}</style>
                <section class="about">
        <div class="hero">
            <h2>About Us</h2>
            <p>
                In <strong>Library</strong>, we believe books have the power
                to transform, inspire, and connect people. Since our beginnings,
                we have worked to create a warm and welcoming space for readers of all ages.
            </p>
        </div>
    </section>
    <div class="gradient-bar"></div>

    <section class="values">
        <div class="card">
            <h3>Our Mission</h3>
               <p>
                To foster a love for reading by offering a carefully curated
                selection of books and a close, passionate service.
            </p>
        </div>

        <div class="card">
            <h3>Our Vision</h3>
            <p>
                To become a reference bookstore in the community and a cultural
                and literary meeting point.
            </p>
        </div>
    </section>

    <section class="team">
        <h2>Our team</h2>
        <div class="team-members">
            <div class="member">
                <h4>Diego</h4>
                <span>Insert role</span>
            </div>
            <div class="member">
                <h4>Andrea</h4>
                <span>Insert role</span>
            </div>
        </div>
    </section>
        </div>

    )
}

export default aboutus;