const uploadInput = document.querySelector("#upload");
const previewImg = document.querySelector("#preview");
const resultDiv = document.querySelector("#result");
const cancelBtn = document.querySelector(".cancel-btn");

const API_KEY = "AIzaSyDv5RXji13NC5k1i6GsATwbXKJ2_sVTHTs";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Show preview & enable cancel
uploadInput.addEventListener("change", () => {
    const file = uploadInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        previewImg.src = e.target.result;
        previewImg.style.display = "block";
        cancelBtn.style.display = "inline-block";
        resultDiv.innerText = ""; // Clear previous result
    };
    reader.readAsDataURL(file);
});

// Cancel Image Button
function cancelImage() {
    uploadInput.value = "";
    previewImg.src = "";
    previewImg.style.display = "none";
    cancelBtn.style.display = "none";
    resultDiv.innerText = "";
}

// Analyze Button Function
async function analyzeImage() {
    const file = uploadInput.files[0];
    if (!file) {
        resultDiv.innerText = "Please upload an image first.";
        return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
        const base64String = e.target.result.split(",")[1];

        const requestBody = {
            contents: [{
                parts: [
                    {
                        inline_data: {
                            data: base64String,
                            mime_type: file.type
                        }
                    },
                    {
                        text: "Identify the network device in this image and describe its use."
                    }
                ]
            }]
        };

        try {
            resultDiv.innerText = "Analyzing...";
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error.message);

            const resultText = data.candidates[0].content.parts[0].text;
            resultDiv.innerHTML = marked.parse(resultText);
        } catch (error) {
            console.error(error);
            resultDiv.innerText = `Error: ${error.message}`;
        }
    };

    reader.readAsDataURL(file);
}
