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
            deadline: null,
            updateTime: null
        }
    },
    methods: {
        onSubmit() {
            today = new Date()
            let task = {
                header: this.header,
                description: this.description,
                creationDate: `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`,
                deadline: this.deadline,
                updateTime: null
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
                <form @submit.prevent="updateTask(index)">
                    <input type="text" id="header" name="header" v-model="task.header"><br>
                    <label for="description">Описание:</label><br>
                    <input type="text" id="description" name="description" v-model="task.description"><br>
                    <p>
                        Создано {{ task.creationDate }}<br>
                        Дэдлайн <input type="text" id="deadline" name="deadline" v-model="task.deadline">
                    </p>
                    <p v-show="task.updateTime">Изменено в {{ task.updateTime }}</p>
                    <input type="submit" value="изменить">
                </form>
                <button @click="removeTask(index)"><img src="assets/cros.svg" alt="remove" width="30" height="30"></button><br>
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
        updateTask(index) {
            today = new Date()
            this.tasks[index].updateTime = `${today.getHours()}:${today.getMinutes()}`
            localStorage.setItem('tasks1', JSON.stringify(this.tasks));
        },
        removeTask(index) {
            let trash = this.tasks.splice(index, 1)
            localStorage.setItem('tasks1', JSON.stringify(this.tasks));
            location.reload();
        },
        moveNext(index) {
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
                <form @submit.prevent="updateTask(index)">
                    <input type="text" id="header" name="header" v-model="task.header"><br>
                    <label for="description">Описание:</label><br>
                    <input type="text" id="description" name="description" v-model="task.description"><br>
                    <p>
                        Создано {{ task.creationDate }}<br>
                        Дэдлайн <input type="text" id="deadline" name="deadline" v-model="task.deadline">
                    </p>
                    <p v-show="task.updateTime">Изменено в {{ task.updateTime }}</p>
                    <input type="submit" value="изменить">
                </form>
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
        updateTask(index) {
            today = new Date()
            this.tasks[index].updateTime = `${today.getHours()}:${today.getMinutes()}`
            localStorage.setItem('tasks2', JSON.stringify(this.tasks));
        },
        moveNext(index) {
            eventBus.$emit('task-to-test', this.tasks[index]);
            let trash = this.tasks.splice(index, 1)
            localStorage.setItem('tasks2', JSON.stringify(this.tasks));
            location.reload();
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
        <ul>
            <li v-for="(task, index) in tasks">
                <form @submit.prevent="updateTask(index)">
                    <input type="text" id="header" name="header" v-model="task.header"><br>
                    <label for="description">Описание:</label><br>
                    <input type="text" id="description" name="description" v-model="task.description"><br>
                    <p>
                        Создано {{ task.creationDate }}<br>
                        Дэдлайн <input type="text" id="deadline" name="deadline" v-model="task.deadline">
                    </p>
                    <p v-show="task.updateTime">Изменено в {{ task.updateTime }}</p>
                    <input type="submit" value="изменить">
                </form>
                <button @click="moveBack(index)"><img src="assets/left.svg" alt="right" width="30" height="30"></button>
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
        updateTask(index) {
            today = new Date()
            this.tasks[index].updateTime = `${today.getHours()}:${today.getMinutes()}`
            localStorage.setItem('tasks3', JSON.stringify(this.tasks));
        },
        moveNext(index) {
            eventBus.$emit('task-complete', this.tasks[index]);
            let trash = this.tasks.splice(index, 1)
            localStorage.setItem('tasks3', JSON.stringify(this.tasks));
            location.reload();
        },
        moveBack(index) {
            eventBus.$emit('task-to-work', this.tasks[index]);
            let trash = this.tasks.splice(index, 1)
            localStorage.setItem('tasks3', JSON.stringify(this.tasks));
            location.reload();
        }
    },
    mounted() {
        if (localStorage.getItem('tasks3')) {
            this.tasks = JSON.parse(localStorage.getItem('tasks3'));
        }
        eventBus.$on('task-to-test', task => {
            this.tasks.push(task)
            localStorage.setItem('tasks3', JSON.stringify(this.tasks));
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