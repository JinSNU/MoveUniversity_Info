document.addEventListener('DOMContentLoaded', function () {
// 필터 UI 추가
function createFilterUI() {
    const inputStyle = 'height: 21px; padding: 2px 5px; border: 1px solid #a3a3a3; border-radius: 4px;';
    const selectStyle = 'height: 28px; padding: 2px 5px; border: 1px solid #a3a3a3; border-radius: 4px;';
    const largeInputStyle = 'height: 50px; padding: 2px 5px; border: 1px solid #a3a3a3; border-radius: 4px;';

    // 필터 전체를 감싸는 컨테이너
    const filterWrapper = document.createElement('div');
    filterWrapper.style.position = 'absolute';
    filterWrapper.style.top = '10px';
    filterWrapper.style.left = '50px';
    filterWrapper.style.zIndex = 1000;
    filterWrapper.style.overflow = 'hidden';  // 내용이 넘칠 경우 숨김 처리

    // 필터 버튼
    const filterToggleButton = document.createElement('button');
    filterToggleButton.textContent = '필터 열기';
    filterToggleButton.style.width = '120px';  // 버튼 너비
    filterToggleButton.style.height = '42px';  // 버튼 너비
    filterToggleButton.style.padding = '10px 20px';  // 버튼 패딩
    filterToggleButton.style.border = '1px solid #a3a3a3';  // 테두리 두께와 색상 설정
    filterToggleButton.style.borderRadius = '20px';  // 둥근 모서리
    filterToggleButton.style.backgroundImage = 'linear-gradient(to right, #ededed, #b7b7b7)';  // 그라데이션 배경
    filterToggleButton.style.color = 'black';  // 텍스트 색상
    filterToggleButton.style.fontWeight = 'bold';  // 텍스트 굵기
    filterToggleButton.style.fontSize = '15px';  // 텍스트 크기
    filterToggleButton.style.boxShadow = 'none';  // 그림자 효과
    filterToggleButton.style.cursor = 'pointer';  // 마우스 커서 변경
    filterToggleButton.style.transition = 'transform 0.3s ease, background 0.3s ease';  // 애니메이션 효과

    // 버튼 호버 효과
    filterToggleButton.onmouseover = function () {
        filterToggleButton.style.backgroundImage = 'linear-gradient(to right, #ededed, #b7b7b7)';  // 배경 그라데이션 반전
    };
    filterToggleButton.onmouseout = function () {
        filterToggleButton.style.transform = 'translateY(0)';  // 원래 위치로 돌아옴
        filterToggleButton.style.backgroundImage = 'linear-gradient(to right, #b7b7b7, #ededed)';  // 원래 배경색으로 돌아옴
    };

    // 버튼 클릭 이벤트
    filterToggleButton.onclick = function () {
        if (filterContainer.style.display === 'none') {
            filterContainer.style.display = 'flex';  // 필터 컨테이너 보이기
            filterToggleButton.textContent = '필터 닫기';
        } else {
            filterContainer.style.display = 'none';  // 필터 컨테이너 숨기기
            filterToggleButton.textContent = '필터 열기';
        }
    };

    filterWrapper.appendChild(filterToggleButton);

    // 실제 필터 요소들을 담을 컨테이너
    const filterContainer = document.createElement('div');
    filterContainer.id = 'filter-container';
    filterContainer.style.backgroundColor = 'white';
    filterContainer.style.padding = '0px 15px 20px 15px'; // 패딩 줄임
    filterContainer.style.borderRadius = '5px';
    filterContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
    filterContainer.style.display = 'none';  // 기본적으로 숨김
    filterContainer.style.flexDirection = 'column';  // 세로로 배치
    filterContainer.style.gap = '12px';  // 필터 간 간격 늘림
    filterContainer.style.marginTop = '5px';  // 버튼과의 간격 설정
    filterContainer.style.overflow = 'visible'; // 오버플로우를 보이도록 설정
    filterContainer.style.width = '200px'; // 고정된 가로 길이 설정

    // 필터 제목
    const filterTitle = document.createElement('h3');
    filterTitle.textContent = '필터';
    filterTitle.style.marginBottom = '10px';
    filterContainer.appendChild(filterTitle);

    // 1. 서비스 타입 필터
    const serviceTypeFilter = document.createElement('select');
    serviceTypeFilter.id = 'filter-service-type';
    serviceTypeFilter.innerHTML = `
        <option value="">서비스 타입</option>
        <option value="1">1톤팀</option>
        <option value="2">익스프레스</option>
        <option value="3">당근</option>
        <option value="4">청소</option>
        <option value="5">에어컨</option>
        <option value="6">창고</option>
        <option value="7">파출부</option>
        <option value="8">인테리어</option>
        <option value="9">기타</option>
    `;
    serviceTypeFilter.style.cssText = selectStyle;
    filterContainer.appendChild(serviceTypeFilter);

    // 2. 이름 필터
    const nameFilter = document.createElement('input');
    nameFilter.id = 'filter-name';
    nameFilter.type = 'text';
    nameFilter.placeholder = '이름';
    nameFilter.style.cssText = inputStyle;
    filterContainer.appendChild(nameFilter);

    // 3. 차량 번호 필터 (기본적으로 숨김)
    const vehicleNumberFilter = document.createElement('input');
    vehicleNumberFilter.id = 'filter-vehicle-number';
    vehicleNumberFilter.type = 'text';
    vehicleNumberFilter.placeholder = '차량 번호';
    vehicleNumberFilter.style.cssText = inputStyle;
    vehicleNumberFilter.style.display = 'none';  // 초기에는 숨김
    filterContainer.appendChild(vehicleNumberFilter);

    // 4. 전화 번호 필터
    const phoneNumberFilter = document.createElement('input');
    phoneNumberFilter.id = 'filter-phone-number';
    phoneNumberFilter.type = 'text';
    phoneNumberFilter.placeholder = '전화 번호';
    phoneNumberFilter.style.cssText = inputStyle;
    filterContainer.appendChild(phoneNumberFilter);

    // 전화 번호 입력 필드에 이벤트 리스너 추가
    phoneNumberFilter.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, ''); // 숫자 이외의 문자 제거

        if (value.length > 11) {
            value = value.slice(0, 11); // 최대 11자리까지만 허용
        }

        if (value.length > 10) {
            value = value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        } else if (value.length > 9) {
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        } else if (value.length > 8) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3');
        } else if (value.length > 4) {
            value = value.replace(/(\d{4})(\d{1,4})/, '$1-$2');
        }

        e.target.value = value;
    });

    // 5. 지역 이름 필터
    const locationFilter = document.createElement('input');
    locationFilter.id = 'filter-location';
    locationFilter.type = 'text';
    locationFilter.placeholder = '지역 이름';
    locationFilter.style.cssText = inputStyle;
    filterContainer.appendChild(locationFilter);

    // 6. 차량 톤수 및 차량 종류 필터를 위한 컨테이너 생성 (기본적으로 숨김)
    const vehicleTonnageTypeFilterContainer = document.createElement('div');
    vehicleTonnageTypeFilterContainer.style.display = 'none'; // 초기에는 숨김
    vehicleTonnageTypeFilterContainer.style.flexDirection = 'row';
    vehicleTonnageTypeFilterContainer.style.alignItems = 'center';
    vehicleTonnageTypeFilterContainer.style.gap = '5px';

    // 차량 톤수 필터
    const vehicleTonnageFilter = document.createElement('input');
    vehicleTonnageFilter.id = 'filter-vehicle-tonnage';
    vehicleTonnageFilter.type = 'number';
    vehicleTonnageFilter.placeholder = '톤수';
    vehicleTonnageFilter.style.width = '50px';
    vehicleTonnageFilter.style.height = '18px';
    vehicleTonnageFilter.style.padding = '2px 5px';
    vehicleTonnageTypeFilterContainer.appendChild(vehicleTonnageFilter);

    const tonLabel = document.createElement('span');
    tonLabel.textContent = '톤';
    tonLabel.style.marginRight = '10px';
    vehicleTonnageTypeFilterContainer.appendChild(tonLabel);

    // 차량 종류 필터
    const vehicleTypeFilter = document.createElement('select');
    vehicleTypeFilter.id = 'filter-vehicle-type';
    vehicleTypeFilter.innerHTML = `
        <option value="">차량 종류</option>
        <option value="1">카고</option>
        <option value="2">호루</option>
        <option value="3">탑차</option>
        <option value="4">윙바디</option>
        <option value="5">리프트카</option>
        <option value="6">냉동탑</option>
        <option value="7">냉동윙</option>
        <option value="8">전기차</option>
        <option value="9">전기리프트</option>
        <option value="10">다마스</option>
        <option value="11">라보</option>
    `;
    vehicleTypeFilter.style.height = '28px';
    vehicleTypeFilter.style.padding = '2px 5px';
    vehicleTypeFilter.style.width = '100px';
    vehicleTonnageTypeFilterContainer.appendChild(vehicleTypeFilter);

    // 컨테이너를 필터 컨테이너에 추가
    filterContainer.appendChild(vehicleTonnageTypeFilterContainer);

    // 7. 이사 종류 필터 (기본적으로 숨김)
    const movingTypeFilter = document.createElement('select');
    movingTypeFilter.id = 'filter-moving-type';
    movingTypeFilter.innerHTML = `
        <option value="">이사 종류</option>
        <option value="1">포장이사</option>
        <option value="2">반포장이사</option>
        <option value="3">일반이사</option>
        <option value="4">익스프레스</option>
        <option value="5">단순용달</option>
    `;
    movingTypeFilter.style.height = '28px';
    movingTypeFilter.style.padding = '2px 5px';
    movingTypeFilter.style.display = 'none';  // 초기에는 숨김
    filterContainer.appendChild(movingTypeFilter);

    // 8. 충성도 필터 (범위 슬라이더)
    const loyaltyFilter = createRangeSlider('loyalty', '충성도', 0, 10, 1);
    filterContainer.appendChild(loyaltyFilter);

    // 9. 친절도 필터 (범위 슬라이더)
    const friendlinessFilter = createRangeSlider('friendliness', '친절도', 0, 10, 1);
    filterContainer.appendChild(friendlinessFilter);

    // 10. 배차 횟수 필터 (범위 슬라이더)
    const dispatchCountFilter = createRangeSlider('dispatch-count', '배차 횟수', 0, 1000, 1);
    filterContainer.appendChild(dispatchCountFilter);

    // 11. 추가 메모 필터
    const additionalNotesContainer = document.createElement('div');
    additionalNotesContainer.style.position = 'relative';

    const additionalNotesFilter = document.createElement('textarea');
    additionalNotesFilter.id = 'filter-additional-notes';
    additionalNotesFilter.style.cssText = largeInputStyle;
    additionalNotesFilter.style.overflowY = 'auto'; // 스크롤 가능
    additionalNotesFilter.style.width = '95%'; // 가로 길이를 100%로 설정하여 다른 입력칸과 맞춤
    additionalNotesFilter.style.maxWidth = '98%'; // 최대 너비를 500px로 설정
    additionalNotesFilter.placeholder = '추가 메모';

    additionalNotesContainer.appendChild(additionalNotesFilter);
    filterContainer.appendChild(additionalNotesContainer);

    function applyFilters() {
        const nameFilterValue = document.getElementById('filter-name').value.toLowerCase() || '';
        const phoneNumberFilterValue = document.getElementById('filter-phone-number').value || '';
        const additionalNotesFilterValue = document.getElementById('filter-additional-notes').value.toLowerCase() || '';
        const friendlinessFilterValues = document.getElementById('friendliness-slider').noUiSlider.get().map(Number);
        const serviceTypeFilterValue = document.getElementById('filter-service-type').value;
        const vehicleNumberFilterValue = document.getElementById('filter-vehicle-number').value.toLowerCase() || '';
        const locationFilterValue = document.getElementById('filter-location').value.toLowerCase() || '';
        const vehicleTonnageFilterValue = document.getElementById('filter-vehicle-tonnage').value || '';
        const vehicleTypeFilterValue = document.getElementById('filter-vehicle-type').value;
        const movingTypeFilterValue = document.getElementById('filter-moving-type').value;
    
        console.log('Name Filter:', nameFilterValue);
        console.log('Phone Number Filter:', phoneNumberFilterValue);
        console.log('Additional Notes Filter:', additionalNotesFilterValue);
        console.log('Friendliness Filter:', friendlinessFilterValues);
        console.log('Service Type Filter:', serviceTypeFilterValue);
        console.log('Vehicle Number Filter:', vehicleNumberFilterValue);
        console.log('Location Filter:', locationFilterValue);
        console.log('Vehicle Tonnage Filter:', vehicleTonnageFilterValue);
        console.log('Vehicle Type Filter:', vehicleTypeFilterValue);
        console.log('Moving Type Filter:', movingTypeFilterValue);
    
        markers.clearLayers();
    
        let hasVisibleMarkers = false;
    
        Object.values(vehicleMarkers).forEach(marker => {
            const vehicleData = marker.options.vehicleData;
            if (vehicleData && vehicleData.name) {
                const { name, phoneNumber, additionalNotes, friendliness, serviceType, vehicleNumber, location, vehicleTonnage, vehicleType, movingType } = vehicleData;
                const markerName = name.toLowerCase();
                const markerNotes = additionalNotes.toLowerCase();
                const markerLocation = location.toLowerCase();
                const markerVehicleNumber = vehicleNumber ? vehicleNumber.toLowerCase() : '';
    
                console.log('Checking Marker:', markerName, phoneNumber, markerNotes, friendliness, serviceType, markerVehicleNumber, markerLocation, vehicleTonnage, vehicleType, movingType);
    
                if (
                    markerName.includes(nameFilterValue) &&
                    phoneNumber.includes(phoneNumberFilterValue) &&
                    markerNotes.includes(additionalNotesFilterValue) &&
                    friendliness >= friendlinessFilterValues[0] &&
                    friendliness <= friendlinessFilterValues[1] &&
                    (serviceTypeFilterValue === '' || serviceType.toString() === serviceTypeFilterValue) &&
                    markerVehicleNumber.includes(vehicleNumberFilterValue) &&
                    markerLocation.includes(locationFilterValue) &&
                    (vehicleTonnageFilterValue === '' || vehicleTonnage.toString() === vehicleTonnageFilterValue) &&
                    (vehicleTypeFilterValue === '' || vehicleType.toString() === vehicleTypeFilterValue) &&
                    (movingTypeFilterValue === '' || movingType.toString() === movingTypeFilterValue)
                ) {
                    markers.addLayer(marker);
                    hasVisibleMarkers = true;
                    console.log('Marker added:', markerName);
                } else {
                    console.log('Marker not added:', markerName);
                }
            }
        });
    
        if (!hasVisibleMarkers) {
            console.log('No markers matched, adding all markers back.');
            Object.values(vehicleMarkers).forEach(marker => {
                markers.addLayer(marker);
            });
        }
    
        map.addLayer(markers);
    }
    // 필터 적용 버튼
    const filterButton = document.createElement('button');
    filterButton.textContent = '필터 적용';
    filterButton.style.width = '100%';
    filterButton.onclick = applyFilters;
    filterContainer.appendChild(filterButton);

    // 필터 초기화 버튼
    const resetButton = document.createElement('button');
    resetButton.textContent = '필터 초기화';
    resetButton.style.width = '100%';
    resetButton.onclick = resetFilters;
    filterContainer.appendChild(resetButton);

    // 서비스 타입 필터 변경에 따른 필터 표시/숨기기 로직 추가
    serviceTypeFilter.addEventListener('change', function () {
        const serviceType = serviceTypeFilter.value;
        const isOneTonTeam = serviceType === "1";

        // 1톤팀일 때만 추가 필터 표시
        vehicleNumberFilter.style.display = isOneTonTeam ? 'block' : 'none';
        vehicleTonnageTypeFilterContainer.style.display = isOneTonTeam ? 'flex' : 'none';
        movingTypeFilter.style.display = isOneTonTeam ? 'block' : 'none';
    });
    serviceTypeFilter.dispatchEvent(new Event('change'));

    // 필터 전체를 감싸는 요소에 추가
    filterWrapper.appendChild(filterContainer);
    document.getElementById('map-container').appendChild(filterWrapper); // map-container에 추가
}
// 초기 필터 UI 생성 호출
createFilterUI();

});




// 범위 슬라이더 생성 함수 (양쪽 핸들을 사용하여 조절 가능)
function createRangeSlider(id, label, min, max, step) {
    const rangeContainer = document.createElement('div');
    rangeContainer.style.display = 'flex';
    rangeContainer.style.flexDirection = 'column';
    rangeContainer.style.marginBottom = '0px';

    const rangeLabel = document.createElement('label');
    rangeLabel.textContent = `${label}: `;
    rangeContainer.appendChild(rangeLabel);

    const slider = document.createElement('div'); // 슬라이더 요소 생성
    slider.id = `${id}-slider`;
    rangeContainer.appendChild(slider);

    const rangeValues = document.createElement('div');
    rangeValues.id = `${id}-values`;
    rangeValues.textContent = `${min} - ${max}`;
    rangeContainer.appendChild(rangeValues);

    // noUiSlider 생성
    noUiSlider.create(slider, {
        start: [min, max],  // 초기 값
        connect: true,  // 범위 사이에 연결선 표시
        range: {
            'min': min,
            'max': max
        },
        step: step
    });

    // 슬라이더 값이 변경될 때 이벤트 처리
    slider.noUiSlider.on('update', function (values) {
        rangeValues.textContent = `${Math.round(values[0])} - ${Math.round(values[1])}`; // 값 업데이트
    });

    return rangeContainer;
}

// 필터 초기화 함수
function resetFilters() {
    document.getElementById('filter-service-type').value = '';
    document.getElementById('filter-name').value = '';
    document.getElementById('filter-vehicle-number').value = '';
    document.getElementById('filter-phone-number').value = '';
    document.getElementById('filter-location').value = '';
    document.getElementById('filter-vehicle-tonnage').value = ''; // 추가된 필터 필드도 초기화
    document.getElementById('filter-vehicle-type').value = '';
    document.getElementById('filter-moving-type').value = '';
    document.getElementById('filter-additional-notes').value = '';
    
    // 슬라이더 초기화
    document.getElementById('loyalty-slider').noUiSlider.set([0, 10]);
    document.getElementById('friendliness-slider').noUiSlider.set([0, 10]);
    document.getElementById('dispatch-count-slider').noUiSlider.set([0, 1000]);

    // 마커 레이어 초기화
    markers.clearLayers();

    // 모든 마커를 다시 추가 (초기 상태로 복원)
    Object.values(vehicleMarkers).forEach(marker => {
        markers.addLayer(marker);
    });

    map.addLayer(markers); // 모든 마커를 지도에 추가

    // 초기화 후 필터를 다시 적용하여 필터 조건을 만족하는 마커만 남도록 설정
    applyFilters();
}



