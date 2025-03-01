let eventBus = new Vue()

Vue.component('newTask', {
    template: `
        <form @submit.prevent="onSubmit">
            <label for="header">Загаловок:</label><br>
            <input type="text" id="header" name="header" v-model="header"><br>
            <label for="description">Описание:</label><br>
            <input type="text" id="description" name="description" v-model="description"><br>
            <label for="deadline">Дэдлайн:</label><br>
            <input type="date" id="deadline" name="deadline" v-model="deadline"><br><br>
            <input type="submit" value="Создать">
        </form>
    `,
    data() {
        return {
            header: null,
            description: null,
            creationDate: null,
            deadline: null,
            updateTime: null,
            problem: null,
            statusCompletion: null,
            priority: true
        }
    },
    methods: {
        onSubmit() {
            today = new Date()
            let task = {
                header: this.header,
                description: this.description,
                creationDate: `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`,
                deadline: this.deadline,
                updateTime: null,
                problem: null,
                statusCompletion: null,
                priority: true
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
                        Дэдлайн <input type="date" id="deadline" name="deadline" v-model="task.deadline">
                        {{ task.priority }}
                    </p>
                    <p v-show="task.updateTime">Изменено в {{ task.updateTime }}</p>
                    <input type="submit" value="изменить" v-show="task.priority">
                </form>
                <button @click="removeTask(index)" v-show="task.priority"><img src="assets/cros.svg" alt="remove" width="30" height="30"></button><br>
                <button @click="moveNext(index)" v-show="task.priority"><img src="assets/right.svg" alt="right" width="30" height="30"></button>
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
        setPriority(index) {
            let today = new Date();
            let deadline = new Date(this.tasks[index].deadline)
            deadline.setDate(deadline.getDate() - 2);
            if(today >= deadline) {
                eventBus.$emit('allFalse', this.tasks[index].header)
                this.tasks[index].priority = true;
            }
        },
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
            this.setPriority(index)
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
        eventBus.$on('allFalse', () => {
            let i = 0;

            while (i < this.tasks.length) {
                this.tasks[i].priority = false;
                i++;
            }
            localStorage.setItem('tasks1', JSON.stringify(this.tasks));
        })
        eventBus.$on('allTrue', () => {
            let i = 0;

            while (i < this.tasks.length) {
                this.tasks[i].priority = true;
                i++;
            }
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
                        Дэдлайн <input type="date" id="deadline" name="deadline" v-model="task.deadline">
                        {{ task.priority }}
                    </p>
                    <p v-show="task.updateTime">Изменено в {{ task.updateTime }}</p>
                    <input type="submit" value="изменить" v-show="task.priority">
                </form>
                <p v-show="task.problem">
                    Нужно изменить:<br>
                    {{ task.problem }}
                </p>
                <button @click="moveNext(index)" v-show="task.priority"><img src="assets/right.svg" alt="right" width="30" height="30"></button>
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
        setPriority(index) {
            let today = new Date();
            let deadline = new Date(this.tasks[index].deadline)
            deadline.setDate(deadline.getDate() - 2);
            if(today >= deadline) {
                eventBus.$emit('allFalse')
                this.tasks[index].priority = true;
            }
        },
        updateTask(index) {
            today = new Date()
            this.tasks[index].updateTime = `${today.getHours()}:${today.getMinutes()}`
            this.setPriority(index)
            localStorage.setItem('tasks2', JSON.stringify(this.tasks));
        },
        moveNext(index) {
            this.setPriority(index)
            this.tasks[index].problem = null
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
        eventBus.$on('allFalse', () => {
            let i = 0;

            while (i < this.tasks.length) {
                this.tasks[i].priority = false;
                i++;
            }
            localStorage.setItem('tasks2', JSON.stringify(this.tasks));
        })
        eventBus.$on('allTrue', () => {
            let i = 0;

            while (i < this.tasks.length) {
                this.tasks[i].priority = true;
                i++;
            }
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
                        Дэдлайн <input date="text" id="deadline" name="deadline" v-model="task.deadline">
                        {{ task.priority }}
                    </p>
                    <p v-show="task.updateTime">Изменено в {{ task.updateTime }}</p>
                    <input type="submit" value="изменить" v-show="task.priority">
                </form>
                <button @click="moveNext(index)" v-show="task.priority"><img src="assets/right.svg" alt="right" width="30" height="30"></button>
                <form @submit.prevent="moveBack(index)">
                    <label for="problem">Причина возврата:</label><br>
                    <input type="text" id="problem" name="problem" v-model="task.problem" required><br>
                    <input type="submit" value="Вернуть в разработку" v-show="task.priority">
                </form>
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
        setPriority(index) {
            let today = new Date();
            let deadline = new Date(this.tasks[index].deadline)
            deadline.setDate(deadline.getDate() - 2);
            if(today >= deadline) {
                eventBus.$emit('allFalse')
                this.tasks[index].priority = true;
            }
        },
        updateTask(index) {
            today = new Date()
            this.tasks[index].updateTime = `${today.getHours()}:${today.getMinutes()}`
            this.setPriority(index)
            localStorage.setItem('tasks3', JSON.stringify(this.tasks));
        },
        moveNext(index) {
            let today = new Date();
            let deadline = new Date(this.tasks[index].deadline)
            if(today > deadline) {
                this.tasks[index].statusCompletion = `Просрочено`
            } else {
                this.tasks[index].statusCompletion = `Сдано в срок`
            }
            eventBus.$emit('task-complete', this.tasks[index]);
            let trash = this.tasks.splice(index, 1)
            localStorage.setItem('tasks3', JSON.stringify(this.tasks));
            location.reload();
        },
        moveBack(index) {
            this.setPriority(index)
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
        eventBus.$on('allFalse', () => {
            let i = 0;

            while (i < this.tasks.length) {
                this.tasks[i].priority = false;
                i++;
            }
            localStorage.setItem('tasks3', JSON.stringify(this.tasks));
        })
        eventBus.$on('allTrue', () => {
            let i = 0;

            while (i < this.tasks.length) {
                this.tasks[i].priority = true;
                i++;
            }
            localStorage.setItem('tasks3', JSON.stringify(this.tasks));
        })
    }
})

Vue.component('column4', {
    template: `
    <div class="p-2 border border-primary">
        <h4>Выполненные задачи</h4>
        <ul>
            <li v-for="task in tasks">
                    {{ task.header }}
                    <p>Описание:<br>
                    {{ task.description }}
                    </p>
                    <p>
                        Создано {{ task.creationDate }}<br>
                        Дэдлайн {{ task.deadline }}<br>
                        Статус {{ task.statusCompletion }}
                    </p>
                    <p v-show="task.updateTime">Изменено в {{ task.updateTime }}</p>
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
        if (localStorage.getItem('tasks4')) {
            this.tasks = JSON.parse(localStorage.getItem('tasks4'));
        }
        eventBus.$on('task-complete', task => {
            this.tasks.push(task)
            eventBus.$emit('allTrue');
            localStorage.setItem('tasks4', JSON.stringify(this.tasks));
        })
    }
})

let app = new Vue({
    el: '#app'
})
//