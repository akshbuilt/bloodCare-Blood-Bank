const supabaseUrl = "https://jsmkyuzqatgvlmliyjdf.supabase.co";
const supabaseKey = "sb_publishable_9NZGLnpfxDlospuMphyQ8w_bR3yPE2_";

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

async function loadStock() {

    // FETCH DONORS
    const { data: donors, error: dError } = await supabaseClient
        .from("donors")
        .select("blood_group");

    // FETCH REQUESTS
    const { data: requests, error: rError } = await supabaseClient
        .from("blood_requests")
        .select("blood_group");

    if (dError || rError) {
        console.log(dError || rError);
        alert("Database error / RLS issue");
        return;
    }

    // INIT OBJECTS
    let donorCount = {};
    let requestCount = {};

    bloodGroups.forEach(bg => {
        donorCount[bg] = 0;
        requestCount[bg] = 0;
    });

    // COUNT DONORS
    (donors || []).forEach(d => {
        donorCount[d.blood_group]++;
    });

    // COUNT REQUESTS
    (requests || []).forEach(r => {
        requestCount[r.blood_group]++;
    });

    renderBoxes(donorCount, requestCount);
    renderChart(donorCount, requestCount);
}

// 🟢 CARDS UI
function renderBoxes(donors, requests) {

    const container = document.getElementById("stockBoxes");
    container.innerHTML = "";

    bloodGroups.forEach(bg => {

        container.innerHTML += `
            <div class="box green">
                <div>${bg}</div>
                <div>Donors: ${donors[bg]}</div>
            </div>

            <div class="box red">
                <div>${bg}</div>
                <div>Requests: ${requests[bg]}</div>
            </div>
        `;
    });
}

// 📊 CHART
function renderChart(donors, requests) {

    new Chart(document.getElementById("bloodChart"), {
        type: "bar",
        data: {
            labels: bloodGroups,
            datasets: [
                {
                    label: "Donors (Available)",
                    data: bloodGroups.map(bg => donors[bg]),
                    backgroundColor: "#2ecc71"
                },
                {
                    label: "Requests (Demand)",
                    data: bloodGroups.map(bg => requests[bg]),
                    backgroundColor: "#e74c3c"
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "top" }
            }
        }
    });
}

loadStock();