const supabaseUrl = "https://jsmkyuzqatgvlmliyjdf.supabase.co";
const supabaseKey = "sb_publishable_9NZGLnpfxDlospuMphyQ8w_bR3yPE2_";

const supabaseClient = supabase.createClient(
    supabaseUrl,
    supabaseKey
);

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("bloodForm");
    const btn = document.getElementById("submitBtn");
    const loader = document.getElementById("loaderOverlay");

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        try {

            loader.style.display = "flex";

            btn.disabled = true;
            btn.innerHTML = "Sending OTP...";

            let phone =
                document.getElementById("phone")
                .value
                .trim();

            if (!phone.startsWith("+91")) {
                phone = "+91" + phone;
            }

            const formData = {
                patient_name:
                    document.getElementById("name").value,

                phone: phone,

                email:
                    document.getElementById("email").value,

                age:
                    document.getElementById("age").value,

                gender:
                    document.querySelector(
                        'input[name="gender"]:checked'
                    )?.value,

                blood_group:
                    document.getElementById("bloodGroup").value,

                address:
                    document.getElementById("address").value,

                weight:
                    document.getElementById("weight").value,

                urgency:
                    document.getElementById("urgency").value
            };

            // Validation

            if (
                !formData.patient_name ||
                !formData.phone ||
                !formData.email ||
                !formData.age ||
                !formData.gender ||
                !formData.blood_group ||
                !formData.address ||
                !formData.weight ||
                !formData.urgency
            ) {

                loader.style.display = "none";

                btn.disabled = false;
                btn.innerHTML = "Submit";

                alert("Please fill all fields.");

                return;
            }

            localStorage.setItem(
                "pendingData",
                JSON.stringify(formData)
            );

            localStorage.setItem(
                "phone",
                phone
            );

            const { error } =
                await supabaseClient.auth.signInWithOtp({
                    phone: phone
                });

            if (error) {

                console.error(error);

                loader.style.display = "none";

                btn.disabled = false;
                btn.innerHTML = "Submit";

                alert(
                    "OTP FAILED\n\n" +
                    error.message
                );

                return;
            }

            loader.style.display = "none";

            btn.innerHTML =
                "OTP Sent Successfully";

            alert(
                "OTP Sent Successfully!"
            );

            setTimeout(() => {
                window.location.href =
                    "otp.html";
            }, 1000);

        } catch (err) {

            console.error(err);

            loader.style.display = "none";

            btn.disabled = false;
            btn.innerHTML = "Submit";

            alert(
                "SYSTEM ERROR\n\n" +
                err.message
            );
        }

    });

});