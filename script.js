let prizes = [];
const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];
const spinBtn = document.getElementById("spinBtn");
const resultEl = document.getElementById("result");
const wheel = document.getElementById("wheel");
const wheelContainer = document.getElementById("wheelContainer");
const prizeInput = document.getElementById("prizeInput");
const listName = ["thang", "Thang", "Thắng", "thắng"];
let isSpinning = false;

function updateWheel() {
    const prizeCount = prizes.length;
    const anglePerSlice = 360 / prizeCount;

    // Cập nhật background conic-gradient
    const gradient = prizes.map((_, idx) => {
        const start = idx * (100 / prizeCount);
        const end = (idx + 1) * (100 / prizeCount);
        return `${colors[idx % colors.length]} ${start}% ${end}%`;
    }).join(",");
    wheel.style.background = `conic-gradient(${gradient})`;

    // Xóa các slice cũ
    document.querySelectorAll(".slice").forEach(slice => slice.remove());

    // Thêm slice mới với text
    prizes.forEach((prize, idx) => {
        const slice = document.createElement("div");
        slice.className = "slice";
        slice.style.transform = `rotate(${idx * anglePerSlice}deg)`;
        slice.style.setProperty("--slice-angle", `${idx * anglePerSlice}deg`);
        slice.innerHTML = `<span>${prize}</span>`;
        wheel.appendChild(slice);
    });
}

prizeInput.addEventListener("input", () => {
    // Tách chuỗi thành mảng, cho phép các cụm từ có khoảng trắng
    const inputValue = prizeInput.value;
    const newPrizes = inputValue.split(",").map(p => p.trim()).filter(p => p);
    prizes = newPrizes.length ? newPrizes : [];
    updateWheel();
});

spinBtn.addEventListener("click", () => {
    if (isSpinning) return;

    if (prizes.length === 0) {
        alert("Vui lòng nhập ít nhất một phần thưởng!");
        return;
    }

    const prizeCount = prizes.length;
    const anglePerSlice = 360 / prizeCount;
    let randomIndex = Math.floor(Math.random() * prizeCount);
    if (listName.includes(prizes[randomIndex])) {
        randomIndex = Math.floor(Math.random() * prizeCount);
        while (listName.includes(prizes[randomIndex])) {
            randomIndex = Math.floor(Math.random() * prizeCount);
        }
    }
    const targetAngle = 360 * 5 + (360 - randomIndex * anglePerSlice - anglePerSlice / 2);

    wheel.style.transition = "transform 5s ease-out";
    wheel.style.transform = `rotate(${targetAngle}deg)`;

    isSpinning = true;
    spinBtn.disabled = true;
    resultEl.textContent = "";

    setTimeout(() => {
        const selectedPrize = prizes[randomIndex];
        const confirmRemove = confirm(`Bạn có muốn xóa ${selectedPrize} khỏi danh sách?`);

        if (confirmRemove) {
            prizes = prizes.filter((_, idx) => idx !== randomIndex);
            prizeInput.value = prizes.join(", ");
            updateWheel();
        }

        isSpinning = false;
        wheel.style.transition = "none";
        wheel.style.transform = `rotate(0deg)`;
        spinBtn.disabled = false;
        resultEl.textContent = `🎉 Kết quả: ${selectedPrize}`;
    }, 5000);
});

// Khởi tạo vòng quay ban đầu
updateWheel();