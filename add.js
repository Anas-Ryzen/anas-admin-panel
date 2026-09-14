const questionsContainer = document.getElementById("questionsContainer");
const addQuestionBtn = document.getElementById("addQuestionBtn");
const submitBtn = document.getElementById("submitLesson");
const overlay = document.getElementById("overlay")
const APP_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwMYlkcuMPh4wZS6rLlNwzFdoKXnxUcxUO0t5gLYisPtzodmWSaRTI1CVsZ8Vj0G89nvw/exec";

/* ===== إعادة ترقيم الأسئلة ===== */
function renumberQuestions() {
    const questions = questionsContainer.querySelectorAll(".question-card");
    questions.forEach((q, index) => {
        q.querySelector("h4").textContent = `سؤال ${index + 1}`;
    });
}

/* ===== إضافة سؤال ===== */
addQuestionBtn.addEventListener("click", () => {

    const questionCard = document.createElement("div");
    questionCard.className = "question-card";

    questionCard.innerHTML = `
        <h4></h4>

        <div class="field-row">
            <label>نص السؤال</label>
            <input type="text">
        </div>

        <div class="field-row">
            <label>الإجابة الصحيحة</label>
            <input type="text">
        </div>

        <div class="field-row">
            <label>اختيار 1</label>
            <input type="text">
        </div>

        <div class="field-row">
            <label>اختيار 2</label>
            <input type="text">
        </div>

        <div class="field-row">
            <label>اختيار 3</label>
            <input type="text">
        </div>

        <div class="field-row">
            <label>اختيار 4</label>
            <input type="text">
        </div>

        <button class="remove-question-btn">🗑 حذف السؤال</button>
    `;

    questionsContainer.appendChild(questionCard);
    renumberQuestions();
});

/* ===== حذف سؤال ===== */
questionsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-question-btn")) {
        e.target.closest(".question-card").remove();
        renumberQuestions();
    }
});

/* ===== حفظ ===== */
submitBtn.addEventListener("click", () => {
    overlay.style.display = 'block'
    const required = [
        lessonName,
        lessonDesc,
        lessonPrice,
        lessonGrade,
        lessonVideo,
        lessonId
    ];

    for (let field of required) {
        if (!field.value.trim()) {
            alert("❌ من فضلك املأ جميع بيانات الحصة");
            overlay.style.display = 'none'
            return;
        }
    }

    if (questionsContainer.children.length === 0) {
        alert("❌ يجب إضافة سؤال واحد على الأقل");
        overlay.style.display = 'none'
        return;
    }

    const rowData = [
        lessonName.value,
        lessonDesc.value,
        lessonPrice.value,
        lessonGrade.value,
        lessonVideo.value,
        lessonTokens.value || "",
        lessonId.value
    ];

    for (let q of questionsContainer.children) {
        const inputs = q.querySelectorAll("input");

        for (let input of inputs) {
            if (!input.value.trim()) {
                alert("❌ يوجد سؤال أو اختيار ناقص");
                overlay.style.display = 'none'
                return;
            }
            rowData.push(input.value);
        }
    }

    fetch(APP_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({ values: rowData })
    })
    .then(res => res.json())
    .then(() => {
        alert("✅ تم حفظ الحصة");
        location.reload();
    })
    .catch(() => {
        alert("❌ حدث خطأ");
    });
});
