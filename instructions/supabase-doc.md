#Connecting to your new project

javascript
```
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ldookydxztqqhqijeouz.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

```