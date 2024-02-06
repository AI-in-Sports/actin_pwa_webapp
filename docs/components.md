# PWA component library

### PrimaryButton
location: `/components/Primary/Button.vue` <br/>
description: To use ui library button

#### Usage
```vue
<template>
  <PrimaryButton type="submit">ClickMe</PrimaryButton>
</template>
```

#### Props

| name     | type                 | isNullable? |
|----------|----------------------|-------------|
| type     | "submit" \| "button" | true        |
| disabled | boolean              | true        |


### PrimaryCheckBox
location: `/components/Primary/CheckBox.vue` <br/>
description: Check box

#### Usage
```vue
<script lang="ts" setup>
  const selected = ref(false)
</script>
<template>
  <PrimaryCheckBox :checked="selected"/>
</template>
```

#### Props

| name    | type      | isNullable? |
|---------|-----------|-------------|
| checked | boolean   | true        |

### PrimaryIconButton
location: `/components/Primary/IconButton.vue` <br/>
description: Icon Button 

#### Usage
```vue
<script lang="ts" setup>
  import image from "~/assets/images/test.png"
</script>

<template>
  <PrimaryIconButton 
      type="submit" :disabled="false"
      :src="image" alt="image alternative text"
  />
</template>
```

#### Props

| name     | type                 | isNullable? |
|----------|----------------------|-------------|
| type     | "submit" \| "button" | true        |
| disabled | boolean              | true        |
| icon     | string               |             |
| alt      | string               |             |

### PrimaryInput
location: `/components/Primary/Input.vue` <br/>
description: Input component

#### Usage
```vue
<script lang="ts" setup>
</script>

<template>
  <PrimaryInput
      placeholder="شماره تلفن"
      type="tel" v-model:value="phoneNumber"
      :disabled="isSubmit" required
  />
</template>
```

#### Props

| name        | type                                                            | isNullable? |
|-------------|-----------------------------------------------------------------|-------------|
| type        | "text" \| "number" \| "tel" \| "email" \| "password" \| string, | true        |          
| required    | boolean                                                         | true        |
| placeholder | string                                                          |             |
| alt         | string                                                          |             |
| name        | string                                                          |             |
| value       | string                                                          |             | 
| disabled    | boolean                                                         | true        |

### PrimarySelect
location: `/components/Primary/Select.vue` <br/>
description: Input component

#### Usage
```vue
<script lang="ts" setup>
</script>

<template>
  <PrimarySelect
      placeholder="جنسیت" class="w-full mb-[32px]"
      v-model:value="gender"
      :disabled="isSubmit" required>
    <option>مرد</option>
    <option>زن</option>
  </PrimarySelect>
</template>
```

#### Props

| name        | type                                                            | isNullable? |
|-------------|-----------------------------------------------------------------|-------------|
| required    | boolean                                                         | true        |
| placeholder | string                                                          |             |
| name        | string                                                          |             |
| value       | string                                                          |             | 
| disabled    | boolean                                                         | true        |

### HomeReportCard
location: `/components/Home/ReportCard.vue` <br/>
description: Report card

#### Usage
```vue
<script lang="ts" setup>
</script>

<template>
    <HomeReportCard :data="report" />
</template>
```

#### Props

| name  | type |
|-------|------|
| data  | any  |  

### HomeReservationCard
location: `/components/Home/ReservationCard.vue` <br/>
description: Reservation Card

#### Usage
```vue
<script lang="ts" setup>
</script>

<template>
    <HomeReservationCard :data="res" />
</template>
```

#### Props

| name  | type |
|-------|------|
| data  | any  |  