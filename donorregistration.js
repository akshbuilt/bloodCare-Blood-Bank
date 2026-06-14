const supabaseUrl = "https://jsmkyuzqatgvlmliyjdf.supabase.co";
const supabaseKey = "sb_publishable_9NZGLnpfxDlospuMphyQ8w_bR3yPE2_";

const supabaseClient = supabase.createClient(
    supabaseUrl,
    supabaseKey
);

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("donorForm");
    const btn = document.getElementById("submitBtn");
    const loader = document.getElementById("loaderOverlay");

    if (!form) {
        alert("donorForm not found");
        return;
    }

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        loader.style.display = "flex";
        btn.disabled = true;
        btn.innerHTML = "Submitting...";

        try {

            const donorName =
                document.getElementById("donorname").value.trim();

            const phone =
                document.getElementById("mobile").value.trim();

            const email =
                document.getElementById("email").value.trim();

            const age =
                document.getElementById("age").value.trim();

            const bloodGroup =
                document.getElementById("blood-group").value;

            const address =
                document.getElementById("address").value.trim();

            const weight =
                document.getElementById("weight").value.trim();

            const gender =
                document.querySelector(
                    'input[name="gender"]:checked'
                )?.value;

            // Validation
            if (
                !donorName ||
                !phone ||
                !email ||
                !age ||
                !bloodGroup ||
                !address ||
                !weight ||
                !gender
            ) {

                loader.style.display = "none";
                btn.disabled = false;
                btn.innerHTML = "Submit";

                alert("Please fill all fields.");
                return;
            }

            if (phone.length !== 10) {

                loader.style.display = "none";
                btn.disabled = false;
                btn.innerHTML = "Submit";

                alert("Phone number must be 10 digits.");
                return;
            }

            const { data, error } =
                await supabaseClient
                    .from("donors")
                    .insert([
                        {
                            donor_name: donorName,
                            phone: phone,
                            email: email,
                            age: Number(age),
                            gender: gender,
                            blood_group: bloodGroup,
                            address: address,
                            weight: Number(weight)
                        }
                    ])
                    .select();

            if (error) {

                console.error(error);

                loader.style.display = "none";
                btn.disabled = false;
                btn.innerHTML = "Submit";

                alert(
                    "Registration Failed!\n\n" +
                    error.message
                );

                return;
            }

            console.log(data);

            loader.style.display = "none";
            btn.innerHTML = "Registered Successfully";

            alert("🎉 Donor Registered Successfully!");

            form.reset();

            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = "Submit";
            }, 1500);

        } catch (err) {

            console.error(err);

            loader.style.display = "none";
            btn.disabled = false;
            btn.innerHTML = "Submit";

            alert(
                "Unexpected Error!\n\n" +
                err.message
            );
        }

    });

});