// 차량 데이터를 저장하고 관리할 객체
const vehicleMarkers = {};

// 차량 데이터 로드
async function loadVehicleData() {
    const response = await fetch('/api/vehicles');
    const vehicles = await response.json();

    // 기존 클러스터 그룹에서 모든 마커 제거
    markers.clearLayers();
    Object.keys(vehicleMarkers).forEach(id => delete vehicleMarkers[id]);

    vehicles.forEach(vehicle => {
        if (vehicle.latitude && vehicle.longitude) {
            // 서비스 타입에 따른 마커 아이콘 설정
            const icon = serviceTypeIcons[vehicle.serviceType] || createCustomIcon('icon-gray'); // 기본 아이콘 설정

            const marker = L.marker([vehicle.latitude, vehicle.longitude], { icon: icon, vehicleData: vehicle });  // vehicleData로 데이터 저장

            // 차량 정보 합치기 (1톤 카고 형태)
            const vehicleInfo = `${vehicle.vehicleTonnage || ''}톤 ${getVehicleType(vehicle.vehicleType) || ''}`;
           // 서비스 타입 제목 생성
           const serviceTypeTitle = `
           <h3 style="margin-bottom: 5px; margin-top : 0px">${getServiceType(vehicle.serviceType)}</h3>
            <hr style="margin-top: 5px; margin-bottom: 12px"> <!-- 선 추가 -->
       `;  // 중앙 정렬 및 아래 간격 줄이기
            // 모든 정보를 표시하는 팝업 내용 생성 (ID, 위도, 경도 제외)
            let popupContent = `
    <div class="popup-content">
        ${serviceTypeTitle}
        <div><b>이름:</b> ${vehicle.name}</div>
        <div><b>전화 번호:</b> ${vehicle.phoneNumber}</div>
        <div><b>지역 이름:</b> ${vehicle.location || '없음'}</div>
        <div><b>충성도:</b> ${vehicle.loyalty || '없음'}/10</div>
        <div><b>친절도:</b> ${vehicle.friendliness || '없음'}/10</div>
        <div><b>배차 횟수:</b> ${vehicle.dispatchCount || '없음'} 회</div>
        <div><b>방문 가능:</b> ${vehicle.visit ? '예' : '아니오'}</div> <!-- 방문 여부 추가 -->
        <div class="long-text"><b>추가 메모:</b> ${vehicle.additionalNotes || '없음'}</div>
        <button class="edit-button" onclick="editVehicle(${vehicle.id})">수정</button>
        <button class="delete-button" onclick="confirmDelete(${vehicle.id})">삭제</button>
    </div>
`;

            // 1톤팀일 경우에만 차량 정보 표시
            if (vehicle.serviceType === 1) {
                popupContent = `
                    <div class="popup-content">
                        ${serviceTypeTitle}
                        <div><b>이름:</b> ${vehicle.name}</div>
                        <div><b>차량 번호:</b> ${vehicle.vehicleNumber || '없음'}</div>
                        <div><b>전화 번호:</b> ${vehicle.phoneNumber}</div>
                        <div><b>지역 이름:</b> ${vehicle.location || '없음'}</div>
                        <div><b>차량 정보:</b> ${vehicleInfo.trim() || '없음'}</div> <!-- 합쳐진 차량 정보 표시 -->
                        <div><b>이사 종류:</b> ${getMovingType(vehicle.movingType)}</div>
                        <div><b>충성도:</b> ${vehicle.loyalty || '없음'}/10</div>
                        <div><b>친절도:</b> ${vehicle.friendliness || '없음'}/10</div>
                        <div><b>배차 횟수:</b> ${vehicle.dispatchCount || '없음'} 회</div>
                        <div><b>방문 가능:</b> ${vehicle.visit ? '예' : '아니오'}</div> <!-- 방문 여부 추가 -->
                        <div class="long-text"><b>추가 메모:</b> ${vehicle.additionalNotes || '없음'}</div>
                        <button class="edit-button" onclick="editVehicle(${vehicle.id})">수정</button>
                        <button class="delete-button" onclick="confirmDelete(${vehicle.id})">삭제</button>
                    </div>
                `;
            }
            marker.bindPopup(popupContent, {
                maxWidth: 300  // 팝업의 최대 너비 설정
            });

            // 클러스터 그룹에 마커 추가
            markers.addLayer(marker);

            // 마커를 vehicleMarkers 객체에 저장
            vehicleMarkers[vehicle.id] = marker;
        }
    });

    // 클러스터 그룹을 지도에 추가
    map.addLayer(markers);
}