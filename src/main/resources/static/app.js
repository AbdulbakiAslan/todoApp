// API Base URL
const API_URL = "http://localhost:8081/api/todos";
// Görevleri Fetch Et ve Listele
function fetchTodos() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const todoListBody = document.getElementById("todoListBody");
            todoListBody.innerHTML = ""; // Listeyi Temizle
            data.forEach((todo, index) => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${index + 1}</td> <!-- Sıra Numarası -->
                    <td>${todo.title}</td>
                    <td>${todo.description}</td>
                    <td>${todo.createdAt ? new Date(todo.createdAt).toLocaleDateString() : ""}</td>
                    <td>${todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : ""}</td>
                    <td>${todo.completed ? "Tamamlandı" : "Tamamlanmadı"}</td>
                    <td>
                        <button onclick="completeTodo('${todo.id}')">Tamamla</button>
                        <button onclick="deleteTodo('${todo.id}')">Sil</button>
                    </td>
                `;

                todoListBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Görevler alınırken bir hata oluştu:", error);
        });
}

// Yeni Görev Ekleme
document.getElementById("addTodoBtn").addEventListener("click", function () {
    const title = document.getElementById("todoTitle").value;
    const description = document.getElementById("todoDescription").value;
    const dueDate = document.getElementById("todoDueDate").value;

    if (title.trim() === "" || description.trim() === "") {
        alert("Başlık ve Açıklama boş olamaz!");
        return;
    }

    const newTodo = {
        title: title,
        description: description,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        completed: false
    };

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newTodo)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Görev eklenemedi.");
            }
            return response.json();
        })
        .then(() => {
            document.getElementById("todoTitle").value = "";
            document.getElementById("todoDescription").value = "";
            document.getElementById("todoDueDate").value = "";
            fetchTodos(); // Listeyi Yenile
        })
        .catch(error => {
            console.error("Görev eklenirken hata:", error);
        });
});

// Görev Silme
function deleteTodo(id) {
    fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    })
        .then(() => {
            console.log("Görev başarıyla silindi!");
            fetchTodos(); // Silme işleminden sonra listeyi yenile
        })
        .catch(error => {
            console.error("Görev silinirken hata oluştu:", error);
        });
}

// Görev Tamamlama
function completeTodo(id) {
    fetch(`${API_URL}/${id}`)
        .then(response => response.json())
        .then(todo => {
            todo.completed = !todo.completed; // Durumu Değiştir

            fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(todo)
            })
                .then(() => {
                    fetchTodos(); // Güncellendikten sonra listeyi yenile
                });
        });
}

// Sayfa Yüklendiğinde Görevleri Listele
window.onload = function () {
    fetchTodos();
};
