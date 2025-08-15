/* ===== Reveal on Scroll ===== */
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('reveal');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });

document.querySelectorAll('.card').forEach(el=>observer.observe(el));

/* ===== Countdown Timer (local to user's browser but seeded for Athens) ===== */
(function(){
  const targetISO = window.WEDDING_DATE_ISO || '2025-06-15T17:00:00+03:00';
  const target = new Date(targetISO).getTime();
  const $d = document.getElementById('days');
  const $h = document.getElementById('hours');
  const $m = document.getElementById('minutes');
  const $s = document.getElementById('seconds');
  const started = document.getElementById('started');

  function update(){
    const now = Date.now();
    let diff = Math.max(0, target - now);
    if(diff <= 0){
      if(started) started.classList.remove('hidden');
      $d.textContent = '0'; $h.textContent = '0'; $m.textContent = '0'; $s.textContent = '0';
      clearInterval(timer);
      return;
    }
    const days = Math.floor(diff / (1000*60*60*24));
    diff -= days * (1000*60*60*24);
    const hours = Math.floor(diff / (1000*60*60));
    diff -= hours * (1000*60*60);
    const minutes = Math.floor(diff / (1000*60));
    diff -= minutes * (1000*60);
    const seconds = Math.floor(diff / 1000);

    $d.textContent = String(days);
    $h.textContent = String(hours).padStart(2,'0');
    $m.textContent = String(minutes).padStart(2,'0');
    $s.textContent = String(seconds).padStart(2,'0');
  }
  update();
  const timer = setInterval(update, 1000);
})();

/* ===== Simple client-side validation message ===== */
const form = document.querySelector('form');
if(form){
  form.addEventListener('submit', (e)=>{
    if(!form.checkValidity()){
      e.preventDefault();
      document.getElementById('form-note').textContent = 'Παρακαλούμε συμπληρώστε σωστά τα υποχρεωτικά πεδία.';
    }
  });
}
document.addEventListener("DOMContentLoaded", function() {
  const form = document.querySelector("form");
  const note = document.getElementById("form-note");

  form.addEventListener("submit", async function(event) {
    event.preventDefault(); // Μην αλλάξεις σελίδα

    const data = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        note.textContent = "✅ Ευχαριστούμε! Η επιβεβαίωση στάλθηκε.";
        note.style.color = "green";
        form.reset();
      } else {
        const errorData = await response.json();
        note.textContent = errorData.errors
          ? errorData.errors.map(e => e.message).join(", ")
          : "❌ Σφάλμα αποστολής.";
        note.style.color = "red";
      }
    } catch (err) {
      note.textContent = "❌ Σφάλμα σύνδεσης.";
      note.style.color = "red";
    }
  });
});
document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("rsvp-form");
  const note = document.getElementById("form-note");

  form.addEventListener("submit", async function(event) {
    event.preventDefault(); // Μην αλλάξεις σελίδα

    const data = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        note.textContent = "✅ Ευχαριστούμε! Η επιβεβαίωση στάλθηκε.";
        note.classList.remove("error");
        note.classList.add("success");
        form.reset();
      } else {
        const errorData = await response.json();
        note.textContent = errorData.errors
          ? errorData.errors.map(e => e.message).join(", ")
          : "❌ Σφάλμα αποστολής.";
        note.classList.remove("success");
        note.classList.add("error");
      }
    } catch (err) {
      note.textContent = "❌ Σφάλμα σύνδεσης.";
      note.classList.remove("success");
      note.classList.add("error");
    }
  });
});
 // Ελέγχουμε το πλάτος οθόνης για mobile εικόνα
  function updateInvitationImage() {
    const img = document.querySelector('.invitation-img');
    if (window.innerWidth <= 719) {
      img.src = 'invitation-mobile.png';
    } else {
      img.src = 'invitation-desktop.png';
    }
  }

  // Κλήση κατά τη φόρτωση και στο resize
  window.addEventListener('load', updateInvitationImage);
  window.addEventListener('resize', updateInvitationImage);