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
                    <label>رابط الكلاس ورك</label>
                    <input type="text" value="${cols[5] || ''}">
                </div>

                <div class="field-row">
                    <label>رابط فيديو الواجب</label>
                    <input type="text" value="${cols[6] || ''}">
                </div>

                <div class="field-row">
                    <label>الرقم</label>
                    <input type="number" value="${cols[8] || ''}">
                </div>

                <div class="field-row">
                    <label>الملف المرفق</label>
                    <input type="text" value="${cols[9] || ''}">
                </div>
                
                <button class="submit-btn" data-row="${index + 2}">
                    Update
                </button>
            `;
            card.dataset.oldTokens = cols[6] || '';
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
    const oldTokens = card.dataset.oldTokens;

    const updatedData = [
        inputs[0].value,
        inputs[1].value,
        inputs[2].value,
        inputs[3].value,
        inputs[4].value,
        inputs[5].value,
        inputs[6].value,
        oldTokens,
        inputs[7].value,
        inputs[8].value
    ];
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

