document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("task");
    const taskList = document.getElementById("list");
    const successToast = document.querySelector(".toast.success");
    const errorToast = document.querySelector(".toast.error");

    document.getElementById("liveToastBtn").addEventListener("click", newElement);

    // Enter tuşu ile görev ekleme
    taskInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            newElement();
        }
    });

    // Sayfa yüklendiğinde mevcut liste elemanlarını localStorage'dan al
    loadTasksFromLocalStorage();

    function newElement() {
        let taskValue = taskInput.value.trim();
        if (taskValue === "") {
            showToast(errorToast);
            return;
        }

        // Baş harfleri büyük yapmak ve imla kurallarına uydurmak için fonksiyon ekleyelim
        taskValue = capitalizeTask(taskValue);

        let li = document.createElement("li");
        li.textContent = taskValue;
        li.classList.add("new-task"); // Yeni eklenen görevler için özel bir sınıf ekliyoruz
        addTaskEvents(li);

        taskList.appendChild(li);
        taskInput.value = "";
        showToast(successToast);

        // Yeni görevleri localStorage'a kaydediyoruz
        saveTaskToLocalStorage(taskValue);
    }

    function addTaskEvents(li) {
        let closeButton = document.createElement("span");
        closeButton.textContent = "\u00D7";
        closeButton.classList.add("close");
        closeButton.onclick = function () {
            li.remove();
            // Görev silindiğinde localStorage'dan da kaldır
            removeTaskFromLocalStorage(li.textContent);
        };

        li.appendChild(closeButton);
        li.addEventListener("click", function () {
            li.classList.toggle("checked");
        });
    }

    function showToast(toastElement) {
        $(toastElement).toast("show");
    }

    // Görevi localStorage'a kaydet
    function saveTaskToLocalStorage(task) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Görev silindiğinde localStorage'dan kaldır
    function removeTaskFromLocalStorage(task) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks = tasks.filter(t => t !== task);  // Silinen öğeyi kaldırıyoruz
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Sayfa yüklendiğinde mevcut liste elemanlarını localStorage'dan al ve ekle
    function loadTasksFromLocalStorage() {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => {
            task = capitalizeTask(task);  // LocalStorage'dan gelen görevleri de baş harflerini büyük yapalım
            let li = document.createElement("li");
            li.textContent = task;
            li.classList.add("new-task");
            addTaskEvents(li);  // Burada da addTaskEvents fonksiyonunu çağırıyoruz
            taskList.appendChild(li);
        });
    }

    // Baş harfleri büyük yapacak fonksiyon
    function capitalizeTask(task) {
        return task
            .toLowerCase() // Tüm harfleri küçük yapıyoruz
            .split(' ') // Kelimelere ayırıyoruz
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Her kelimenin ilk harfini büyük yapıyoruz
            .join(' '); // Kelimeleri tekrar birleştiriyoruz
    }
});
