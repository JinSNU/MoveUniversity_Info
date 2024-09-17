// 수정할 기사를 위한 팝업 창 생성
function editVehicle(id) {
    const vehicle = vehicleMarkers[id].options.vehicleData;  // 수정할 차량 정보 가져오기

    // 수정 팝업 창 생성
    const container = document.createElement('div');
    container.id = 'custom-popup';
    container.style.position = 'absolute';
    container.style.backgroundColor = 'white';
    container.style.padding = '20px';
    container.style.borderRadius = '8px';
    container.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.2)';
    container.style.width = '250px';  // 창 너비를 넓게 설정
    container.style.zIndex = 1000;

    // 닫기 버튼 생성
    const closeButton = document.createElement('button');
    closeButton.id = 'close-button';
    closeButton.innerHTML = '&#10005;';  // X 표시
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '18px';
    closeButton.style.fontWeight = 'bold';
    closeButton.style.color = 'black';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = function () {
        document.body.removeChild(container);  // 팝업 제거
    };

    container.appendChild(closeButton);  // 닫기 버튼을 팝업에 추가

    // 제목 생성
    const title = document.createElement('h2');
    title.textContent = '기사 수정';
    title.style.textAlign = 'left';
    title.style.margin = '0 0 10px 0';  // 제목과 입력 필드 사이에 간격 추가

    container.appendChild(title);  // 제목을 팝업에 추가

    // 입력 필드와 버튼 추가
    const formContainer = document.createElement('div');
    formContainer.style.marginTop = '20px';
    formContainer.style.display = 'flex';
    formContainer.style.flexDirection = 'column';
    formContainer.style.gap = '10px';

    // 서비스 타입 선택 그룹
    const serviceTypeGroup = document.createElement('div');
    serviceTypeGroup.className = 'input-group';
    serviceTypeGroup.style.display = 'flex';  // Flexbox 사용
    serviceTypeGroup.style.alignItems = 'center';  // 수직 가운데 정렬
    serviceTypeGroup.innerHTML = `
        <label style="min-width: 100px;">서비스 타입 :</label>
        <select id="edit-service-type" style="width: 150px;">
            <option value="1" ${vehicle.serviceType === 1 ? 'selected' : ''}>1톤팀</option>
            <option value="2" ${vehicle.serviceType === 2 ? 'selected' : ''}>익스프레스</option>
            <option value="3" ${vehicle.serviceType === 3 ? 'selected' : ''}>당근</option>
            <option value="4" ${vehicle.serviceType === 4 ? 'selected' : ''}>청소</option>
            <option value="5" ${vehicle.serviceType === 5 ? 'selected' : ''}>에어컨</option>
            <option value="6" ${vehicle.serviceType === 6 ? 'selected' : ''}>창고</option>
            <option value="7" ${vehicle.serviceType === 7 ? 'selected' : ''}>파출부</option>
            <option value="8" ${vehicle.serviceType === 8 ? 'selected' : ''}>인테리어</option>
            <option value="9" ${vehicle.serviceType === 9 ? 'selected' : ''}>기타</option>
        </select>
    `;
    formContainer.appendChild(serviceTypeGroup);

    // 이름 입력 그룹
    const nameGroup = document.createElement('div');
    nameGroup.className = 'input-group';
    nameGroup.style.display = 'flex';  // Flexbox 사용
    nameGroup.style.alignItems = 'center';  // 수직 가운데 정렬
    nameGroup.innerHTML = `<label style="min-width: 100px;">이름 :</label><input type="text" id="edit-name" style="width: 150px;" value="${vehicle.name}" />`;
    formContainer.appendChild(nameGroup);

    // 차량 번호 입력 그룹
    const vehicleNumberGroup = document.createElement('div');
    vehicleNumberGroup.className = 'input-group';
    vehicleNumberGroup.style.display = 'flex';  // Flexbox 사용
    vehicleNumberGroup.style.alignItems = 'center';  // 수직 가운데 정렬
    vehicleNumberGroup.innerHTML = `<label style="min-width: 100px;">차량 번호 :</label><input type="text" id="edit-vehicle-number" style="width: 150px;" value="${vehicle.vehicleNumber || ''}" />`;
    formContainer.appendChild(vehicleNumberGroup);

// 전화 번호 입력 그룹
const phoneNumberGroup = document.createElement('div');
phoneNumberGroup.className = 'input-group';
phoneNumberGroup.style.display = 'flex';  // Flexbox 사용
phoneNumberGroup.style.alignItems = 'center';  // 수직 가운데 정렬
phoneNumberGroup.innerHTML = `<label style="min-width: 100px;">전화 번호 :</label><input type="text" id="edit-phone-number" style="width: 150px;" value="${vehicle.phoneNumber}" maxlength="13" />`;
formContainer.appendChild(phoneNumberGroup);

// 전화 번호 입력 필드에 이벤트 리스너 추가
const phoneNumberInput = phoneNumberGroup.querySelector('#edit-phone-number');
phoneNumberInput.addEventListener('input', function (e) {
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

    // 지역 이름 입력 그룹
    const locationGroup = document.createElement('div');
    locationGroup.className = 'input-group';
    locationGroup.style.display = 'flex';  // Flexbox 사용
    locationGroup.style.alignItems = 'center';  // 수직 가운데 정렬
    locationGroup.innerHTML = `<label style="min-width: 100px;">지역 이름 :</label><input type="text" id="edit-location" style="width: 150px;" value="${vehicle.location || ''}" />`;
    formContainer.appendChild(locationGroup);

    // 차량 톤수 및 차량 종류 입력 그룹 (가로로 배치)
    const vehicleTonnageTypeGroup = document.createElement('div');
    vehicleTonnageTypeGroup.className = 'input-group';
    vehicleTonnageTypeGroup.style.display = 'flex';  // Flexbox 사용
    vehicleTonnageTypeGroup.style.alignItems = 'center';  // 수직 가운데 정렬
    vehicleTonnageTypeGroup.style.display = 'none';  // 초기에는 숨김 처리

    // 라벨 생성
    const vehicleTonnageTypeLabel = document.createElement('label');
    vehicleTonnageTypeLabel.style.minWidth = '100px';
    vehicleTonnageTypeLabel.textContent = '차량 톤수 :';
    vehicleTonnageTypeGroup.appendChild(vehicleTonnageTypeLabel);

    // 입력 필드들을 담을 컨테이너 생성
    const vehicleTonnageTypeInputs = document.createElement('div');
    vehicleTonnageTypeInputs.style.display = 'flex';
    vehicleTonnageTypeInputs.style.alignItems = 'center';
    vehicleTonnageTypeInputs.style.gap = '5px';

    // 차량 톤수 입력 부분
    const vehicleTonnageInput = document.createElement('input');
    vehicleTonnageInput.type = 'number';
    vehicleTonnageInput.id = 'edit-vehicle-tonnage';
    vehicleTonnageInput.style.width = '50px';
    vehicleTonnageInput.value = vehicle.vehicleTonnage || '';
    vehicleTonnageTypeInputs.appendChild(vehicleTonnageInput);

    const tonLabel = document.createElement('span');
    tonLabel.textContent = '톤';
    vehicleTonnageTypeInputs.appendChild(tonLabel);

    // 차량 종류 선택 부분
    const vehicleTypeSelect = document.createElement('select');
    vehicleTypeSelect.id = 'edit-vehicle-type';
    vehicleTypeSelect.style.width = '74px';  // 너비를 74px로 설정하여 정렬 맞춤
    vehicleTypeSelect.innerHTML = `
        <option value="1" ${vehicle.vehicleType === 1 ? 'selected' : ''}>카고</option>
        <option value="2" ${vehicle.vehicleType === 2 ? 'selected' : ''}>호루</option>
        <option value="3" ${vehicle.vehicleType === 3 ? 'selected' : ''}>탑차</option>
        <option value="4" ${vehicle.vehicleType === 4 ? 'selected' : ''}>윙바디</option>
        <option value="5" ${vehicle.vehicleType === 5 ? 'selected' : ''}>리프트카</option>
        <option value="6" ${vehicle.vehicleType === 6 ? 'selected' : ''}>냉동탑</option>
        <option value="7" ${vehicle.vehicleType === 7 ? 'selected' : ''}>냉동윙</option>
        <option value="8" ${vehicle.vehicleType === 8 ? 'selected' : ''}>전기차</option>
        <option value="9" ${vehicle.vehicleType === 9 ? 'selected' : ''}>전기리프트</option>
        <option value="10" ${vehicle.vehicleType === 10 ? 'selected' : ''}>다마스</option>
        <option value="11" ${vehicle.vehicleType === 11 ? 'selected' : ''}>라보</option>
    `;
    vehicleTonnageTypeInputs.appendChild(vehicleTypeSelect);

    // 입력 필드 컨테이너를 그룹에 추가
    vehicleTonnageTypeGroup.appendChild(vehicleTonnageTypeInputs);

    formContainer.appendChild(vehicleTonnageTypeGroup);

    // 이사 종류 선택 그룹
    const movingTypeGroup = document.createElement('div');
    movingTypeGroup.className = 'input-group';
    movingTypeGroup.style.display = 'flex';  // Flexbox 사용
    movingTypeGroup.style.alignItems = 'center';  // 수직 가운데 정렬
    movingTypeGroup.innerHTML = `
        <label style="min-width: 100px;">이사 종류 :</label>
        <select id="edit-moving-type" style="width: 150px;">
            <option value="1" ${vehicle.movingType === 1 ? 'selected' : ''}>포장이사</option>
            <option value="2" ${vehicle.movingType === 2 ? 'selected' : ''}>반포장이사</option>
            <option value="3" ${vehicle.movingType === 3 ? 'selected' : ''}>일반이사</option>
            <option value="4" ${vehicle.movingType === 4 ? 'selected' : ''}>익스프레스</option>
            <option value="5" ${vehicle.movingType === 5 ? 'selected' : ''}>단순용달</option>
        </select>
    `;
    formContainer.appendChild(movingTypeGroup);

    // 충성도 입력 그룹
    const loyaltyGroup = document.createElement('div');
    loyaltyGroup.className = 'input-group';
    loyaltyGroup.style.display = 'flex';  // Flexbox 사용
    loyaltyGroup.style.alignItems = 'center';  // 수직 가운데 정렬
    loyaltyGroup.innerHTML = `<label style="min-width: 100px;">충성도 :</label><input type="number" id="edit-loyalty" style="width: 97px !important; flex-grow: 0;" value="${vehicle.loyalty || ''}" /><span style="margin-left: 5px;">(1~10)</span>`;
    formContainer.appendChild(loyaltyGroup);

    // 친절도 입력 그룹
    const friendlinessGroup = document.createElement('div');
    friendlinessGroup.className = 'input-group';
    friendlinessGroup.style.display = 'flex';  // Flexbox 사용
    friendlinessGroup.style.alignItems = 'center';  // 수직 가운데 정렬
    friendlinessGroup.innerHTML = `<label style="min-width: 100px;">친절도 :</label><input type="number" id="edit-friendliness" style="width: 97px !important; flex-grow: 0;" value="${vehicle.friendliness || ''}" /><span style="margin-left: 5px;">(1~10)</span>`;
    formContainer.appendChild(friendlinessGroup);

    // 배차 횟수 입력 그룹
    const dispatchCountGroup = document.createElement('div');
    dispatchCountGroup.className = 'input-group';
    dispatchCountGroup.style.display = 'flex';  // Flexbox 사용
    dispatchCountGroup.style.alignItems = 'center';  // 수직 가운데 정렬
    dispatchCountGroup.innerHTML = `<label style="min-width: 100px;">배차 횟수 :</label><input type="number" id="edit-dispatch-count" style="width: 150px;" value="${vehicle.dispatchCount || ''}" />`;
    formContainer.appendChild(dispatchCountGroup);

    // 추가 메모 입력 그룹
    const additionalNotesGroup = document.createElement('div');
    additionalNotesGroup.className = 'input-group';
    additionalNotesGroup.style.display = 'flex';  // Flexbox 사용
    additionalNotesGroup.style.alignItems = 'center';  // 수직 가운데 정렬
    additionalNotesGroup.innerHTML = `<label style="min-width: 100px;">추가 메모 :</label><textarea id="edit-additional-notes" style="flex: 1; height: 80px; resize: vertical;">${vehicle.additionalNotes || ''}</textarea>`;
    formContainer.appendChild(additionalNotesGroup);

    // 서비스 타입 선택에 따른 필드 표시/숨기기
    const serviceTypeSelect = serviceTypeGroup.querySelector('#edit-service-type');
    serviceTypeSelect.addEventListener('change', function () {
        const selectedValue = this.value;
        const shouldDisplay = selectedValue === '1';  // 1톤팀일 때만 표시

        vehicleNumberGroup.style.display = shouldDisplay ? 'flex' : 'none';
        vehicleTonnageTypeGroup.style.display = shouldDisplay ? 'flex' : 'none';
        movingTypeGroup.style.display = shouldDisplay ? 'flex' : 'none';
    });

    // 초기 상태에 따라 필드 표시/숨기기
    serviceTypeSelect.dispatchEvent(new Event('change'));

    // 저장 버튼 생성
    const saveButton = document.createElement('button');
    saveButton.textContent = '저장';
    saveButton.onclick = function () {
        saveVehicle(id);  // 수정된 차량 정보 저장 함수 호출
    };
    formContainer.appendChild(saveButton);

    container.appendChild(formContainer);  // 폼을 팝업에 추가
    document.body.appendChild(container);  // 팝업을 문서에 추가

    // 팝업 위치 설정 (화면 중앙에 표시)
    const mouseX = window.innerWidth / 2;
    const mouseY = window.innerHeight / 2;
    const popupWidth = container.offsetWidth;
    const popupHeight = container.offsetHeight;

    let top = mouseY - popupHeight / 2;
    let left = mouseX - popupWidth / 2;
    if (left + popupWidth + 20 > window.innerWidth) {
        left = window.innerWidth - popupWidth - 20;
    }
    if (top + popupHeight + 20 > window.innerHeight) {
        top = window.innerHeight - popupHeight - 20;
    }

    container.style.top = `${top}px`;
    container.style.left = `${left}px`;
}



// 차량 수정 후 저장 함수
async function saveVehicle(id) {
    // 비밀번호 입력 프롬프트
    const password = prompt("비밀번호를 입력하세요:");
    if (password !== "24대학%") {
        alert("비밀번호가 올바르지 않습니다.");
        return;
    }

    const name = document.getElementById('edit-name').value;
    const vehicleNumber = document.getElementById('edit-vehicle-number').value;
    const phoneNumber = document.getElementById('edit-phone-number').value;
    const location = document.getElementById('edit-location').value;
    const vehicleTonnage = parseFloat(document.getElementById('edit-vehicle-tonnage').value);
    const vehicleType = parseInt(document.getElementById('edit-vehicle-type').value);
    const movingType = parseInt(document.getElementById('edit-moving-type').value);
    const serviceType = parseInt(document.getElementById('edit-service-type').value);
    const loyalty = parseInt(document.getElementById('edit-loyalty').value);
    const friendliness = parseInt(document.getElementById('edit-friendliness').value);
    const dispatchCount = parseInt(document.getElementById('edit-dispatch-count').value);
    const additionalNotes = document.getElementById('edit-additional-notes').value;

    // 데이터 유효성 검사
    if (!name || !phoneNumber || !serviceType) {
        alert('데이터를 모두 입력해주세요!');
        return;
    }

    // 충성도와 친절도가 0에서 10 사이인지 확인
    if (loyalty < 0 || loyalty > 10) {
        alert('충성도는 0에서 10 사이의 값을 입력해야 합니다.');
        return;
    }

    if (friendliness < 0 || friendliness > 10) {
        alert('친절도는 0에서 10 사이의 값을 입력해야 합니다.');
        return;
    }

    const updatedVehicle = {
        name,
        vehicleNumber,
        phoneNumber,
        location,
        vehicleTonnage,
        vehicleType,
        movingType,
        serviceType,
        loyalty,
        friendliness,
        dispatchCount,
        additionalNotes
    };

    try {
        const response = await fetch(`/api/vehicles/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedVehicle)
        });

        if (response.ok) {
            alert('기사 수정 완료!');
            loadVehicleData();  // 수정 후 데이터를 다시 불러와 지도 업데이트
            
            // 팝업 닫기
            if (currentPopup) {
                document.body.removeChild(currentPopup);
                currentPopup = null;
            }
            // 수정 팝업도 닫기
            const editPopup = document.getElementById('custom-popup');
            if (editPopup) {
                document.body.removeChild(editPopup);
            }
        } else {
            alert('기사 수정 실패: ' + response.statusText);
        }
    } catch (error) {
        console.error('수정 실패:', error);
        alert(`기사 수정 실패: ${error}`);
    }
}


// 삭제 확인 함수 및 삭제 함수는 동일
function confirmDelete(id) {
    const confirmed = confirm('정말로 이 기사를 삭제하시겠습니까?');
    if (confirmed) {
        deleteVehicle(id);
    }
}
// Helper 함수들: 숫자 값을 사람이 읽을 수 있는 텍스트로 변환
function getVehicleType(type) {
    const types = {
        1: '카고',
        2: '호루',
        3: '탑차',
        4: '윙바디',
        5: '리프트카',
        6: '냉동탑',
        7: '냉동윙',
        8: '전기차',
        9: '전기리프트',
        10: '다마스',
        11: '라보'
    };
    return types[type] || '기타';
}

function getMovingType(type) {
    const types = {
        1: '포장이사',
        2: '반포장이사',
        3: '일반이사',
        4: '익스프레스',
        5: '단순용달'
    };
    return types[type] || '기타';
}

function getServiceType(type) {
    const types = {
        1: '1톤팀',
        2: '익스프레스',
        3: '당근',
        4: '청소',
        5: '에어컨',
        6: '창고',
        7: '파출부',
        8: '인테리어',
        9: '기타'
    };
    return types[type] || '기타';
}


// 차량 삭제 함수
async function deleteVehicle(id) {
    try {
        const response = await fetch(`/api/vehicles/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('기사 삭제 완료!');

            // 마커를 클러스터 그룹에서 제거
            const marker = vehicleMarkers[id];
            if (marker) {
                markers.removeLayer(marker);
                delete vehicleMarkers[id];
            }
        } else {
            alert('기사 삭제 실패: ' + response.statusText);
        }
    } catch (error) {
        console.error('삭제 실패:', error);
        alert(`기사 삭제 실패: ${error}`);
    }
}