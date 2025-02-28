let eventBus = new Vue()

Vue.component('newTask', {
    template: `
        <form @submit.prevent="onSubmit">
            <label for="header">Загаловок:</label><br>
            <input type="text" id="header" name="header" v-model="header"><br>
            <label for="description">Описание:</label><br>
            <input type="text" id="description" name="description" v-model="description"><br>
            <label for="deadline">Дэдлайн:</label><br>
            <input type="text" id="deadline" name="deadline" v-model="deadline"><br><br>
            <input type="submit" value="Создать">
        </form>
    `,
    data() {
        return {
            header: null,
            description: null,
            creationDate: null,
            deadline: null
        }
    },
    methods: {
        onSubmit() {
            today = new Date()
            let task = {
                header: this.header,
                description: this.description,
                creationDate: `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`,
                deadline: this.deadline
            }
            eventBus.$emit('task-created', task)
            this.header = null
            this.description = null
            this.creationDate = null
            this.deadline = null
        }
    }
})

Vue.component('column1', {
    template: `
    <div class="p-2 border border-primary">
        <h4>Запланированные задачи</h4>
        <newTask class="p-2 border border-primary"></newTask>
        <ul>
            <li v-for="(task, index) in tasks">
                {{ task.header }}<br>
                {{ task.description }}<br>
                <p>
                    Создано {{ task.creationDate }}<br>
                    Дэдлайн {{ task.deadline }}
                </p>
                <button @click="removeTask(index)"><img src="assets/cros.svg" alt="remove" width="30" height="30"></button>
                <button @click="moveNext(index)"><img src="assets/right.svg" alt="right" width="30" height="30"></button>
                <hr></hr>
            </li>
        </ul>
    </div>
    `,
    data() {
        return {
            tasks: []
        }
    },
    methods: {
        removeTask(index) {
            let trash = this.tasks.splice(index, 1)
            localStorage.setItem('tasks1', JSON.stringify(this.tasks));
            location.reload();
        },
        moveNext(index) {
            let task = {
                header: this.header,
                description: this.description,
                creationDate: this.creationDate,
                deadline: this.deadline
            }
            eventBus.$emit('task-to-work', this.tasks[index]);
            let trash = this.tasks.splice(index, 1)
            localStorage.setItem('tasks1', JSON.stringify(this.tasks));
            location.reload();
        }
    },
    mounted() {
        if (localStorage.getItem('tasks1')) {
            this.tasks = JSON.parse(localStorage.getItem('tasks1'));
        }
        eventBus.$on('task-created', task => {
            this.tasks.push(task)
            localStorage.setItem('tasks1', JSON.stringify(this.tasks));
        })
    }
})

Vue.component('column2', {
    template: `
    <div class="p-2 border border-primary">
        <h4>Задачи в работе</h4>
        <ul>
            <li v-for="(task, index) in tasks">
                {{ task.header }}<br>
                {{ task.description }}<br>
                <p>
                    Создано {{ task.creationDate }}<br>
                    Дэдлайн {{ task.deadline }}
                </p>
                <button @click="moveNext(index)"><img src="assets/right.svg" alt="right" width="30" height="30"></button>
                <hr></hr>
            </li>
        </ul>
    </div>
    `,
    data() {
        return {
            tasks: []
        }
    },
    mounted() {
        if (localStorage.getItem('tasks2')) {
            this.tasks = JSON.parse(localStorage.getItem('tasks2'));
        }
        eventBus.$on('task-to-work', task => {
            this.tasks.push(task)
            localStorage.setItem('tasks2', JSON.stringify(this.tasks));
        })
    }
})

Vue.component('column3', {
    template: `
    <div class="p-2 border border-primary">
        <h4>Тестирование</h4>
    </div>
    `,
    data() {
        return {
            tasks: []
        }
    },
    mounted() {
        eventBus.$on('task-to-test', task => {
            this.tasks.push(task)
        })
    }
})

Vue.component('column4', {
    template: `
    <div class="p-2 border border-primary">
        <h4>Выполненные задачи</h4>
    </div>
    `,
    data() {
        return {
            tasks: []
        }
    },
    mounted() {
        eventBus.$on('task-complete', task => {
            this.tasks.push(task)
        })
    }
})

let app = new Vue({
    el: '#app'
})