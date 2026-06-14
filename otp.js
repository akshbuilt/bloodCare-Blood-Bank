const supabaseUrl = "https://jsmkyuzqatgvlmliyjdf.supabase.co";
const supabaseKey = "sb_publishable_9NZGLnpfxDlospuMphyQ8w_bR3yPE2_";

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
async function verifyOtp() {

    const otp = document.getElementById("otpInput").value.trim();
    const phone = localStorage.getItem("phone");

    const btn = document.getElementById("verifyBtn");

    try {

        btn.disabled = true;
        btn.innerHTML = "⏳ Verifying...";

        // 🔥 IMPORTANT FIX
        const { data, error } = await supabaseClient.auth.verifyOtp({
            phone: phone,
            token: otp,
            type: "sms"
        });

        console.log(data, error);

        if (error) {
            alert("❌ OTP Wrong: " + error.message);

            btn.disabled = false;
            btn.innerHTML = "Verify OTP";
            return;
        }

        alert("🎉 OTP Verified!");

        const formData = JSON.parse(localStorage.getItem("pendingData"));

        const { error: dbError } = await supabaseClient
            .from("blood_requests")
            .insert([formData]);

        if (dbError) {
            alert("❌ DB Error: " + dbError.message);
            return;
        }

        alert("🎉 Blood Request Submitted Successfully!");

        localStorage.clear();
        window.location.href = "index.html";

    } catch (err) {
        console.log(err);
        alert("❌ Error: " + err.message);
    }
}