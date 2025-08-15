
<?php
// ---------- ΡΥΘΜΙΣΕΙΣ ----------
// ΑΛΛΑΞΤΕ ΤΟ EMAIL ΠΑΡΑΛΗΠΤΗ
$TO = "youremail@example.com"; // π.χ. "onoma@domain.gr"
$SUBJECT = "RSVP - Προσκλητήριο Γάμου";

// ---------- ΜΗΝ ΑΛΛΑΖΕΤΕ ΑΠΟ ΔΩ ΚΑΙ ΚΑΤΩ ΑΝ ΔΕΝ ΧΡΕΙΑΖΕΤΑΙ ----------
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Βασική προστασία
    function clean($v){
        return trim(filter_var($v ?? '', FILTER_SANITIZE_FULL_SPECIAL_CHARS));
    }
    $name   = clean($_POST['name'] ?? '');
    $email  = clean($_POST['email'] ?? '');
    $guests = intval($_POST['guests'] ?? 0);
    $attend = clean($_POST['attend'] ?? '');
    $msg    = clean($_POST['message'] ?? '');

    // Έλεγχος υποχρεωτικών
    $errors = [];
    if ($name === '')   { $errors[] = "Το ονοματεπώνυμο είναι υποχρεωτικό."; }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { $errors[] = "Μη έγκυρο email."; }
    if ($guests < 1)    { $errors[] = "Ο αριθμός ατόμων πρέπει να είναι τουλάχιστον 1."; }
    if ($attend === '') { $errors[] = "Παρακαλούμε επιλέξτε αν θα παρευρεθείτε."; }

    if (count($errors) === 0) {
        $body  = "Νέα απάντηση RSVP:\n\n";
        $body .= "Όνομα: {$name}\n";
        $body .= "Email: {$email}\n";
        $body .= "Αριθμός Ατόμων: {$guests}\n";
        $body .= "Παρουσία: {$attend}\n";
        if ($msg !== '') { $body .= "Μήνυμα: {$msg}\n"; }
        $body .= "\n— Αυτόματο μήνυμα από τη φόρμα RSVP του προσκλητηρίου.";

        $headers  = "From: RSVP <no-reply@" . ($_SERVER['SERVER_NAME'] ?? 'yourdomain') . ">\r\n";
        $headers .= "Reply-To: {$email}\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

        $sent = @mail($TO, $SUBJECT, $body, $headers);

        // Απλή σελίδα απάντησης
        echo "<!doctype html><html lang='el'><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><title>Ευχαριστούμε</title>";
        echo "<style>body{font-family:system-ui,Inter,Arial;padding:40px;background:#f5f5f5;color:#111} .wrap{max-width:720px;margin:0 auto;background:#fff;border-radius:14px;box-shadow:0 20px 40px rgba(0,0,0,.12);padding:24px} a.btn{display:inline-block;margin-top:12px;padding:10px 16px;border:1px solid #000;border-radius:999px;text-decoration:none;color:#000}</style>";
        echo "<div class='wrap'>";
        if ($sent) {
            echo "<h1>Ευχαριστούμε!</h1><p>Η απάντησή σας καταχωρήθηκε επιτυχώς.</p>";
        } else {
            echo "<h1>Σφάλμα αποστολής</h1><p>Δυστυχώς το email δεν στάλθηκε. Ελέγξτε τις ρυθμίσεις mail του server σας.</p>";
        }
        echo "<a class='btn' href='index.html'>&larr; Επιστροφή</a></div></html>";
        exit;
    } else {
        // Επιστροφή με λάθη
        echo "<!doctype html><html lang='el'><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><title>Σφάλμα</title>";
        echo "<style>body{font-family:system-ui,Inter,Arial;padding:40px;background:#f5f5f5;color:#111} .wrap{max-width:720px;margin:0 auto;background:#fff;border-radius:14px;box-shadow:0 20px 40px rgba(0,0,0,.12);padding:24px} ul{line-height:1.8}</style>";
        echo "<div class='wrap'><h1>Παρακαλούμε διορθώστε:</h1><ul>";
        foreach ($errors as $e) { echo "<li>" . $e . "</li>"; }
        echo "</ul><p><a href='index.html'>Επιστροφή στη φόρμα</a></p></div></html>";
        exit;
    }
}
// Αν φτάσατε εδώ χωρίς POST, απλή ανακατεύθυνση
header("Location: index.html");
exit;
?>
