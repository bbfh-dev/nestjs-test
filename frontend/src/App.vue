<script setup lang="ts">
import HelloWorld from "./components/HelloWorld.vue"
import TheWelcome from "./components/TheWelcome.vue"
import axios from "axios"
import { ref } from "vue"
import { PhoneFilled, MailFilled, UserOutlined } from "@ant-design/icons-vue"

let searchValue: string

const queryData = async () => {
    let url = "leads"
    if (searchValue && searchValue.length > 0) {
        url = `leads/${encodeURI(searchValue)}`
    }

    const response = await axios.get(`http://localhost:3000/api/${url}`)
    const result = []

    for (const lead of response.data.leads) {
        result.push({
            key: lead.id,
            name: lead.name,
            budget: lead.price,
            status: {
                name: lead.status.name,
                color: lead.status.color,
            },
            responsible: {
                name: lead.user.name,
                email: lead.user.email,
            },
            created_at: new Date(lead.created_at),
            contacts: lead.contacts,
        })
    }

    return result
}

const loading = ref<boolean>(true)
let data = []

queryData().then((i) => {
    data = i
    loading.value = false
})

const columns = [
    {
        title: "Название",
        dataIndex: "name",
        key: "name",
        fixed: true,
    },
    {
        title: "Бюджет",
        dataIndex: "budget",
        key: "budget",
    },
    {
        title: "Статус",
        dataIndex: "status",
        key: "status",
    },
    {
        title: "Ответственный",
        dataIndex: "responsible",
        key: "responsible",
    },
    {
        title: "Дата создания",
        dataIndex: "created_at",
        key: "created_at",
    },
]
</script>

<template class="main">
    <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        title="Пример тестового задания"
    >
        <template #extra>
            <a-input-search
                v-model:value="searchValue"
                placeholder="input search text"
                style="width: 200px"
                @search="
                    () => {
                        loading = true
                        data = []
                        queryData().then((i) => {
                            data = i
                            loading = false
                        })
                    }
                "
            />
        </template>
    </a-page-header>

    <a-table :dataSource="data" :columns="columns" :loading="loading">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
                <span
                    class="status"
                    :style="{ backgroundColor: record.status.color }"
                    >{{ record.status.name }}</span
                >
            </template>
            <template v-if="column.key === 'responsible'">
                <a :href="'mailto:' + record.responsible.email">{{
                    record.responsible.name
                }}</a>
            </template>
            <template v-if="column.key === 'created_at'">
                <span>{{ record.created_at }}</span>
            </template>
        </template>
        <template #expandedRowRender="{ record }">
            <span v-for="contact in record.contacts" class="contact">
                <UserOutlined />
                {{ contact.name }}
                <div v-for="field in contact.custom_fields_values">
                    <a
                        v-if="field.field_code === 'PHONE'"
                        :href="'tel:' + field.values[0].value"
                    >
                        <PhoneFilled />
                    </a>
                    <a
                        v-else-if="field.field_code === 'EMAIL'"
                        :href="'mailto:' + field.values[0].value"
                    >
                        <MailFilled />
                    </a>
                </div>
            </span>
        </template>
        <template #expandColumnTitle>
            <span></span>
        </template>
    </a-table>
</template>

<style scoped>
body {
    background: white;
}

.status {
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    outline: 1px solid rgb(0 0 0 / 1);
}

.contact {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
}
</style>
