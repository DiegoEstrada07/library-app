export default function AboutUS(){
    return(
        <div class="aboutus-page">
            <style>
                {`
                    .top {
                        background: #222;
                        color: #fff;
                        padding: 40px 20px;
                        text-align: center;
                    }

                    .aboutus-page {
                        margin: 0;
                        padding:0;
                        box-sizing:border-box;
                        font-family: Arial, Helvetica, sans-serif;
                        line-height: 1.6;
                        background-color: #f4f4f4;
                        color: #333;
                    }

                    .container {
                        max-width: 1000px;
                        margin: 30px auto;
                        padding: 0 20px;
                    }

                    .section {
                        background: #fff;
                        padding: 30px;
                        margin-bottom: 20px;
                        border-radius: 6px;
                    }

                    .section h2 {
                        margin-top: 0;
                        color: #222;
                    }

                    .values {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 20px;
                    }

                    .value-box {
                        background: #f9f9f9;
                        padding: 20px;
                        border-radius: 6px;
                        text-align: center;
                    }
                `}                
            </style>
            <div class="top">
                <h1>About Us</h1>
                <p>Get to know who we are and what we stand for</p>
            </div>
            <div class="container">
                <div class="section">
                    <h2>Who We Are</h2>
                    <p>
                        text
                    </p>
                </div>
                <div class="section">
                    <h2>Our Mission</h2>
                    <p>
                        more text
                    </p>
                </div>
                <div class="section">
                    <h2>guess what</h2>
                    <div class="values">
                        <div class="value-box">
                            <h3>More</h3>
                            <p>Text</p>
                        </div>
                        <div class="value-box">
                            <h3>text</h3>
                            <p>println("text")</p>
                        </div>
                        <div class="value-box">
                            <h3>more text</h3>
                            <p>Plese spesify your text or not.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}