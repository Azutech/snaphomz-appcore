export const resendVerification = (profile: string): string => {
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Snaphomz</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background-color: #f7f7f7;
    }

    .container {
      max-width: 600px;
      margin: 20px auto;
      padding: 0;
      background-color: #fff;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .logo-section {
      padding: 20px 40px;
    }

    .logo-section img {
      height: 24px;
      width: auto;
    }

    .orange-header {
      background-color: #F57D42;
      padding: 20px;
      color: #fff;
      text-align: center;
    }

    .orange-header h2 {
      margin: 0;
      font-size: 24px;
    }

    .image-banner {
      border: 2px solid #4C9AFF;
      margin: 0;
    }

    .image-banner img {
      width: 100%;
      display: block;
    }

    .content {
      padding: 20px 40px;
      text-align: center;
    }

    h1 {
      color: #000;
      font-size: 24px;
      margin: 20px 0;
      font-weight: bold;
    }

    .quick-start {
      background-color: #f7f7f7;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }

    .quick-start h3 {
      margin-top: 0;
      text-align: left;
    }

    ul {
      text-align: left;
      padding-left: 20px;
    }

    li {
      margin-bottom: 10px;
    }

    .button {
      display: inline-block;
      margin: 10px 0 20px;
      padding: 12px 24px;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      color: #fff;
      background-color: #000;
      border: none;
      border-radius: 25px;
      text-decoration: none;
    }

    .help-section {
      margin: 40px 0;
      text-align: center;
    }

    .help-section h3 {
      margin-bottom: 30px;
    }

    .help-options {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .help-option {
      flex: 1;
      text-align: center;
      padding: 0 10px;
    }

    .option-number {
      display: inline-block;
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border: 1px solid #ddd;
      border-radius: 50%;
      margin-bottom: 10px;
    }

    .help-option a {
      color: #F57D42;
      text-decoration: none;
    }

    .signature {
      margin-top: 40px;
      text-align: left;
    }

    .signature p {
      margin: 5px 0;
    }

    .signature .company-name {
      font-weight: bold;
    }

    .support {
      margin-top: 10px;
      text-align: left;
      font-size: 14px;
      color: #666;
    }

    .support a {
      color: #F57D42;
      text-decoration: none;
    }

    .footer {
      background-color: #000;
      color: #fff;
      padding: 20px;
      text-align: center;
      font-size: 12px;
    }

    .footer p {
      color: #fff;
      margin: 5px 0;
      font-size: 12px;
    }

    .footer a {
      color: #fff;
      text-decoration: underline;
      margin: 0 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo-section">
      <img src="https://drive.google.com/uc?export=view&id=162Xg-4DS552bG_EJbfmsNrQDYcrt61Us" alt="Snaphomz">
    </div>
    <div class="orange-header">
      <h2>Welcome</h2>
    </div>
    <div class="image-banner">
      <img src="https://drive.google.com/uc?export=view&id=your-handshake-image-id" alt="Handshake">
    </div>
    <div class="content">
      <h1>Finally, a simpler way to win your dream listings.</h1>
      
      <div class="quick-start">
        <h3>Here's your quick start guide</h3>
        <ul>
          <li>Complete your profile (2 mins)</li>
          <li>Create your first listing</li>
          <li>Share your custom property page</li>
        </ul>
        <a href="#" class="button">Go to Profile</a>
      </div>
      
      <div class="help-section">
        <h3>Need help getting started?</h3>
        <div class="help-options">
          <div class="help-option">
            <div class="option-number">1</div>
            <a href="#">Watch our 2-min tutorial</a>
          </div>
          <div class="help-option">
            <div class="option-number">2</div>
            <a href="#">Chat with support</a>
          </div>
          <div class="help-option">
            <div class="option-number">3</div>
            <a href="#">Schedule a demo call</a>
          </div>
        </div>
      </div>
      
      <div class="signature">
        <p>We're here to help you win more listings.</p>
        <p>Best,</p>
        <p class="company-name">Snaphomz</p>
        
        <div class="support">
          <p>P.S. Have questions? Reply to this email or reach us a <a href="mailto:support@snaphomz">support@snaphomz</a></p>
        </div>
      </div>
    </div>
    <div class="footer">
      <p>© Snaphomz, 151 O'Connor Street, Ground floor, Ottawa ON, K2P 2L8</p>
      <p>
        <a href="#">Unsubscribe</a> |
        <a href="#">View in the browser</a>
      </p>
    </div>
  </div>
</body>
</html>`;
};
