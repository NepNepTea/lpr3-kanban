let eventBus = new Vue()

Vue.component('newTask', {
    template: `
        <form @submit.prevent="onSubmit">
            <label for="header">Загаловок:</label><br>
            <input type="text" id="header" name="header" v-model="header"><br>
            <label for="description">Описание:</label><br>
            <input type="text" id="description" name="description" v-model="description"><br>
            <label for="deadline">Дэдлайн:</label><br>
            <input type="datetime-local" id="deadline" name="deadline" v-model="deadline"><br><br>
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
            let task = {
                header: this.header,
                description: this.description,
                creationDate: new Date(),
                deadline: new Date(this.deadline)
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
        <newTask class="p-2 border border-primary"></newTask>
        <ul>
            <li v-for="task in tasks">
                {{ task.header }}<br>
                {{ task.description }}<br>
                <p>
                    Создано {{ task.creationDate.getDate() }}-{{ task.creationDate.getMonth() + 1 }}-{{ task.creationDate.getFullYear() }} в {{ task.creationDate.getHours() }}:{{ task.creationDate.getMinutes() }}<br>
                    Дэдлайн {{ task.deadline.getDate() }}-{{ task.deadline.getMonth() + 1 }}-{{ task.deadline.getFullYear() }} в {{ task.deadline.getHours() }}:{{ task.deadline.getMinutes() }}
                </p>
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
    },
    mounted() {
        eventBus.$on('task-created', task => {
            this.tasks.push(task)
        })
    }
})

Vue.component('column2', {
    template: `
    <div class="p-2 border border-primary">
        <p>empty</p>
    </div>
    `,
    data() {
        return {
            tasks: []
        }
    },
})

Vue.component('column3', {
    template: `
    <div class="p-2 border border-primary">
        <p>empty</p>
    </div>
    `,
    data() {
        return {
            tasks: []
        }
    },
})

Vue.component('column4', {
    template: `
    <div class="p-2 border border-primary">
        <p>empty</p>
    </div>
    `,
    data() {
        return {
            tasks: []
        }
    },
})

Vue.component('column5', {
    template: `
    <div class="p-2 border border-primary">
        <p>empty</p>
    </div>
    `,
    data() {
        return {
            tasks: []
        }
    },
})

let app = new Vue({
    el: '#app'
})