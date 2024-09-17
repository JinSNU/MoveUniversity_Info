// 독차가 데이터 정의
const dokchagaData = [
    { minDistance: 0, maxDistance: 20, fee: 40000 },
    { minDistance: 20, maxDistance: 30, fee: 45000 },
    { minDistance: 30, maxDistance: 35, fee: 50000 },
    { minDistance: 35, maxDistance: 40, fee: 55000 },
    { minDistance: 40, maxDistance: 45, fee: 60000 },
    { minDistance: 45, maxDistance: 50, fee: 65000 },
    { minDistance: 50, maxDistance: 55, fee: 70000 },
    { minDistance: 55, maxDistance: 60, fee: 75000 },
    { minDistance: 60, maxDistance: 65, fee: 80000 },
    { minDistance: 65, maxDistance: 70, fee: 85000 },
    { minDistance: 70, maxDistance: 75, fee: 90000 },
    { minDistance: 75, maxDistance: 80, fee: 95000 },
    { minDistance: 80, maxDistance: 90, fee: 100000 },
    { minDistance: 90, maxDistance: 100, fee: 105000 },
    { minDistance: 100, maxDistance: 110, fee: 110000 },
    { minDistance: 110, maxDistance: 120, fee: 115000 },
    { minDistance: 120, maxDistance: 125, fee: 120000 },
    { minDistance: 125, maxDistance: 140, fee: 125000 },
    { minDistance: 140, maxDistance: 150, fee: 130000 },
    { minDistance: 150, maxDistance: 165, fee: 135000 },
    { minDistance: 165, maxDistance: 175, fee: 140000 },
    { minDistance: 175, maxDistance: 190, fee: 145000 },
    { minDistance: 190, maxDistance: 200, fee: 150000 },
    { minDistance: 200, maxDistance: 210, fee: 155000 },
    { minDistance: 210, maxDistance: 220, fee: 160000 },
    { minDistance: 220, maxDistance: 230, fee: 165000 },
    { minDistance: 230, maxDistance: 245, fee: 170000 },
    { minDistance: 245, maxDistance: 255, fee: 175000 },
    { minDistance: 255, maxDistance: 270, fee: 180000 },
    { minDistance: 270, maxDistance: 280, fee: 185000 },
    { minDistance: 280, maxDistance: 293, fee: 190000 },
    { minDistance: 293, maxDistance: 305, fee: 195000 },
    { minDistance: 305, maxDistance: 320, fee: 200000 },
    { minDistance: 320, maxDistance: 325, fee: 205000 },
    { minDistance: 325, maxDistance: 340, fee: 210000 },
    { minDistance: 340, maxDistance: 360, fee: 215000 },
    { minDistance: 360, maxDistance: 365, fee: 220000 },
    { minDistance: 365, maxDistance: 370, fee: 225000 },
    { minDistance: 370, maxDistance: 380, fee: 230000 },
    { minDistance: 380, maxDistance: 385, fee: 240000 },
    { minDistance: 385, maxDistance: 395, fee: 245000 },
    { minDistance: 395, maxDistance: 400, fee: 250000 },
    { minDistance: 400, maxDistance: 415, fee: 255000 },
    { minDistance: 415, maxDistance: 420, fee: 260000 },
    { minDistance: 420, maxDistance: 425, fee: 265000 },
    { minDistance: 425, maxDistance: 435, fee: 270000 },
    { minDistance: 435, maxDistance: 445, fee: 275000 },
    { minDistance: 445, maxDistance: 455, fee: 280000 },
    { minDistance: 455, maxDistance: 465, fee: 285000 },
    { minDistance: 465, maxDistance: 475, fee: 290000 },
    { minDistance: 475, maxDistance: 485, fee: 295000 },
    { minDistance: 485, maxDistance: 490, fee: 300000 },
    { minDistance: 490, maxDistance: 500, fee: 325000 },
    { minDistance: 500, maxDistance: 510, fee: 330000 },
    { minDistance: 510, maxDistance: 515, fee: 335000 },
    { minDistance: 515, maxDistance: 520, fee: 340000 },
    { minDistance: 520, maxDistance: 525, fee: 345000 },
    { minDistance: 525, maxDistance: 530, fee: 350000 },
    { minDistance: 530, maxDistance: 540, fee: 355000 },
    { minDistance: 540, maxDistance: 555, fee: 360000 },
    { minDistance: 555, maxDistance: 600, fee: 365000 },
    { minDistance: 600, maxDistance: Infinity, fee: 380000 } // 마지막 구간
];

// 독차가 계산 함수
function calculateDokchaga(distance) {
    for (let data of dokchagaData) {
        if (distance >= data.minDistance && distance < data.maxDistance) {
            return data.fee;
        }
    }
    // 이 부분에 도달할 일은 없지만, 안전을 위해 남겨둡니다.
    return dokchagaData[dokchagaData.length - 1].fee;
}

// export 문을 제거하고 전역 변수로 설정합니다.
window.calculateDokchaga = calculateDokchaga;