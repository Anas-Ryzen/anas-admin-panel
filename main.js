const sheetId = '1ou-3Gr1pOsRVlSoN4Ou0go51qS6OKxYL_RbfcBnPmwE';
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

            // إصلاح عرض أرقام الهواتف إذا كانت تبدأ بـ '
            const cols = row.split(',').map((col, i) => {
                if ((i === 3 || i === 4) && col.startsWith("'")) {
                    return col.slice(1); // إزالة الـ ' عند العرض
                }
                return col;
            });

            const card = document.createElement("div");
            card.className = "user-card";

            card.innerHTML = `
                <h3 class="card-title">طالب رقم ${index + 1}</h3>

                <div class="field-row">
                    <label>اسم الطالب</label>
                    <input type="text" value="${cols[0] || ''}">
                </div>

                <div class="field-row">
                    <label>اسم الأب</label>
                    <input type="text" value="${cols[1] || ''}">
                </div>

                <div class="field-row">
                    <label>اسم الجد</label>
                    <input type="text" value="${cols[2] || ''}">
                </div>

                <div class="field-row">
                    <label>رقم هاتف الطالب</label>
                    <input type="text" value="${cols[3] || ''}">
                </div>

                <div class="field-row">
                    <label>رقم هاتف ولي الأمر</label>
                    <input type="text" value="${cols[4] || ''}">
                </div>

                <div class="field-row">
                    <label>كلمة السر</label>
                    <input type="text" value="${cols[5] || ''}">
                </div>

                <div class="field-row">
                    <label>الصف الدراسي</label>
                    <input type="text" value="${cols[6] || ''}">
                </div>

                <div class="field-row">
                    <label>حالة التفعيل</label>
                    <input type="text" value="${cols[7] || ''}">
                </div>

                <div class="field-row">
                    <label>التوكن</label>
                    <input type="text" value="${cols[8] || ''}">
                </div>

                <div class="field-row">
                    <label>المحفظة</label>
                    <input type="number" value="${cols[9] || 0}">
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

    inputs.forEach((input, i) => {
        let value = input.value;

        // إصلاح أرقام الهواتف قبل الإرسال للـ Google Sheets
        if (i === 3 || i === 4) { // العمود 3 = رقم الطالب، 4 = رقم ولي الأمر
            if (!value.startsWith('0')) value = '0' + value;
            value = "'" + value; // إجبار Google Sheets على التعامل معه كنص
        }

        updatedData.push(value);
    });

    // إرسال البيانات
    fetch("https://script.google.com/macros/s/AKfycbxnXIae8ZCFWiwugXQYYPV1Mvf-7A8KoTg6OmIaeVZ2IAbD5AZTzUV_EZLFMMlbPIne/exec", {
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