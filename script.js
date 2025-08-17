/* ===== Reveal on Scroll ===== */
// Χρησιμοποιούμε IntersectionObserver ώστε τα στοιχεία με κλάση .card να αποκαλύπτονται
// όταν εμφανιστούν στην οθόνη με ένα animation
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('reveal'); // Προσθέτει την κλάση reveal
      observer.unobserve(entry.target); // Σταματάει να παρακολουθεί το στοιχείο
    }
  });
}, { threshold: 0.18 }); // εμφανίζεται όταν το 18% του στοιχείου είναι ορατό

// Ενεργοποίηση observer σε όλες τις κάρτες
document.querySelectorAll('.card').forEach(el=>observer.observe(el));

/* ===== Countdown Timer (local to user's browser but seeded for Athens) ===== */
(function(){
  // Παίρνουμε την ημερομηνία γάμου από το HTML, αλλιώς βάζουμε προεπιλεγμένη
  const targetISO = window.WEDDING_DATE_ISO || '2025-06-15T17:00:00+03:00';
  const target = new Date(targetISO).getTime();

  // Επιλέγουμε τα στοιχεία της αντίστροφης μέτρησης
  const $d = document.getElementById('days');
  const $h = document.getElementById('hours');
  const $m = document.getElementById('minutes');
  const $s = document.getElementById('seconds');
  const started = document.getElementById('started');

  // Συνάρτηση που ενημερώνει το ρολόι
  function update(){
    const now = Date.now();
    let diff = Math.max(0, target - now); // Χρόνος που απομένει
    if(diff <= 0){
      // Αν έφτασε η ώρα του γάμου
      if(started) started.classList.remove('hidden');
      $d.textContent = '0'; $h.textContent = '0'; $m.textContent = '0'; $s.textContent = '0';
      clearInterval(timer);
      return;
    }
    // Υπολογισμός ημερών, ωρών, λεπτών, δευτερολέπτων
    const days = Math.floor(diff / (1000*60*60*24));
    diff -= days * (1000*60*60*24);
    const hours = Math.floor(diff / (1000*60*60));
    diff -= hours * (1000*60*60);
    const minutes = Math.floor(diff / (1000*60));
    diff -= minutes * (1000*60);
    const seconds = Math.floor(diff / 1000);

    // Ενημέρωση UI
    $d.textContent = String(days);
    $h.textContent = String(hours).padStart(2,'0');
    $m.textContent = String(minutes).padStart(2,'0');
    $s.textContent = String(seconds).padStart(2,'0');
  }

  update(); // Πρώτη κλήση
  const timer = setInterval(update, 1000); // Επαναλαμβάνεται κάθε δευτερόλεπτο
})();

/* ===== Simple client-side validation message ===== */
// Ελέγχουμε τη φόρμα πριν την αποστολή
const form = document.querySelector('form');
if(form){
  form.addEventListener('submit', (e)=>{
    if(!form.checkValidity()){
      e.preventDefault();
      document.getElementById('form-note').textContent = 'Παρακαλούμε συμπληρώστε σωστά τα υποχρεωτικά πεδία.';
    }
  });
}

/* ===== AJAX Υποβολή RSVP με Fetch ===== */
document.addEventListener("DOMContentLoaded", function() {
  const form = document.querySelector("form");
  const note = document.getElementById("form-note");

  form.addEventListener("submit", async function(event) {
    event.preventDefault(); // Μην αλλάξεις σελίδα (όχι reload)

    const data = new FormData(form);

    try {
      // Στέλνουμε τα δεδομένα με fetch στο Formspree
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        // Επιτυχής αποστολή
        note.textContent = "✅ Ευχαριστούμε! Η επιβεβαίωση στάλθηκε.";
        note.style.color = "green";
        form.reset();
      } else {
        // Σφάλμα από τον server
        const errorData = await response.json();
        note.textContent = errorData.errors
          ? errorData.errors.map(e => e.message).join(", ")
          : "❌ Σφάλμα αποστολής.";
        note.style.color = "red";
      }
    } catch (err) {
      // Σφάλμα σύνδεσης (π.χ. offline)
      note.textContent = "❌ Σφάλμα σύνδεσης.";
      note.style.color = "red";
    }
  });
});

/* ===== Βελτιωμένη έκδοση AJAX RSVP (με CSS classes success/error) ===== */
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
        headers: { 'Accept': 'application/json' }
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

/* ===== Responsive εικόνα προσκλητηρίου ===== */
// Ελέγχουμε το πλάτος οθόνης για να φορτώνουμε τη σωστή εικόνα (desktop/mobile)
function updateInvitationImage() {
  const img = document.querySelector('.invitation-img');
  if (window.innerWidth <= 719) {
    img.src = 'invitation-mobile.png';
  } else {
    img.src = 'invitation-desktop.png';
  }
}

// Κλήση κατά τη φόρτωση και όταν αλλάζει το μέγεθος παραθύρου
window.addEventListener('load', updateInvitationImage);
window.addEventListener('resize', updateInvitationImage);
