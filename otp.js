const supabaseUrl = "https://jsmkyuzqatgvlmliyjdf.supabase.co";
const supabaseKey = "sb_publishable_9NZGLnpfxDlospuMphyQ8w_bR3yPE2_";

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

async function verifyOtp() {

    const otp = document.getElementById("otpInput").value.trim();
    // Phone ki jagah localStorage se Email read karega
    const email = localStorage.getItem("email");

    const btn = document.getElementById("verifyBtn");

    if (!email) {
        alert("Session expired or email missing. Please try submitting again.");
        window.location.href = "bloodrequest.html";
        return;
    }

    try {

        btn.disabled = true;
        btn.innerHTML = " Verifying...";

        // Email OTP verify karne ke liye updated syntax
        const { data, error } = await supabaseClient.auth.verifyOtp({
            email: email,
            token: otp,
            type: "email"
        });

        console.log(data, error);

        if (error) {
            alert(" OTP Wrong: " + error.message);

            btn.disabled = false;
            btn.innerHTML = "Verify OTP";
            return;
        }

        alert("OTP Verified!");

        const formData = JSON.parse(localStorage.getItem("pendingData"));

        const { error: dbError } = await supabaseClient
            .from("blood_requests")
            .insert([formData]);

        if (dbError) {
            alert(" Database Error: " + dbError.message);
            
            btn.disabled = false;
            btn.innerHTML = "Verify OTP";
            return;
        }

        alert("Your Blood Request is Submitted Successfully to our database!");

        localStorage.clear();
        window.location.href = "bloodrequest.html";

    } catch (err) {
        console.log(err);
        alert("Error: " + err.message);

        btn.disabled = false;
        btn.innerHTML = "Verify OTP";
    }
}
