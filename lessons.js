const sheetId = '10lifxmFuDr_qmaYiWVpLxzgbknoiTqJ6pNkLEIb_Hfc';
const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
const overlay = document.getElementById("overlay")
const container = document.getElementById("usersContainer");

fetch(csvUrl)
    .then(res => res.text())
    .then(csv => {

        const rows = csv.trim().split('\n');

        // تجاهل أول صف (عناوين)
        const dataRows = rows.slice(1);

        container.innerHTML = "";

        dataRows.forEach((row, index) => {

            const cols = row.split(',');

            const card = document.createElement("div");
            card.className = "user-card";

            card.innerHTML = `
                <h3 class="card-title">الحصه رقم ${index + 1}</h3>

                <div class="field-row">
                    <label>اسم الحصه</label>
                    <input type="text" value="${cols[0] || ''}">
                </div>

                <div class="field-row">
                    <label>الوصف</label>
                    <input type="text" value="${cols[1] || ''}">
                </div>

                <div class="field-row">
                    <label>السعر</label>
                    <input type="text" value="${cols[2] || ''}">
                </div>

                <div class="field-row">
                    <label>الصف الدراسي</label>
                    <input type="text" value="${cols[3] || ''}">
                </div>

                <div class="field-row">
                    <label>رابط الفيديو</label>
                    <input type="text" value="${cols[4] || ''}">
                </div>

                <div class="field-row">
                    <label>التوكنات المشتركه</label>
                    <input type="text" value="${cols[5] || ''}">
                </div>

                <div class="field-row">
                    <label>الرقم</label>
                    <input type="text" value="${cols[6] || ''}">
                </div>
                
                <button class="submit-btn" data-row="${index + 2}">
                    Update
                </button>
            `;

            container.appendChild(card);
        });

    })
.catch(err => console.error("CSV Error:", err));


container.addEventListener("click", function (e){

    if (!e.target.classList.contains("submit-btn")) return;
    overlay.style.display = 'block'

    const rowNumber = e.target.dataset.row;
    const card = e.target.closest(".user-card");
    const inputs = card.querySelectorAll("input");

    const updatedData = [];

    inputs.forEach(input => {
        updatedData.push(input.value);
    });

    // إرسال البيانات
    fetch("https://script.google.com/macros/s/AKfycbza2nzoH8Cwomz9la4wB9kHdkjsybK7896USexvZPg4462BWhyrbgpGxwIk8JZeHfQ4gQ/exec", {
        method: "POST",
        body: JSON.stringify({
            row: rowNumber,
            values: updatedData
        })
    })
    .then(res => res.json())
    .then(data => {
        alert("تم تحديث البيانات بنجاح ✅");
        location.reload()
    })
    .catch(err => {
        console.error(err);
        alert("حدث خطأ ❌");
    });
});
