# Deserializer

## Deserialize a JSON string

To have the **`DataType`** automatically set based on the JSON object you send, you will need to implement custom deserialization logic. The default deserialization provided by **`serde`** won't automatically infer the **`DataType`** enum variant (**`String`**, **`Integer`**, **`Float`**) based on the JSON values. You'll need to write a custom deserialization function that checks the type of each JSON value and then constructs the appropriate **`DataType`** variant.

Here's a simplified approach on how to achieve this:

### **Step 1: Implement Custom Deserialization for `DataType`**

First, you need to implement custom deserialization for the **`DataType`** enum. This involves implementing the **`Deserialize`** trait for **`DataType`** where you check the JSON value type and then construct the appropriate **`DataType`** variant.

```rust
use serde::{Deserialize, Deserializer};
use serde_json::Value;

impl<'de> Deserialize<'de> for DataType {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        let value = Value::deserialize(deserializer)?;
        match value {
            Value::String(s) => Ok(DataType::String(s)),
            Value::Number(num) => {
                if num.is_f64() {
                    Ok(DataType::Float(num.as_f64().unwrap() as f32))
                } else if num.is_u64() {
                    Ok(DataType::Integer(num.as_u64().unwrap() as u32))
                } else {
                    Err(serde::de::Error::custom("Invalid number type for DataType"))
                }
            }
            _ => Err(serde::de::Error::custom("Invalid type for DataType")),
        }
    }
}

```

### **Step 2: Update Your Structs**

Ensure that all fields that will use the **`DataType`** enum are properly set to use it. From your provided JSON and struct definitions, it seems they are already set up to use **`DataType`**.

### **Step 3: Deserialize JSON**

When you deserialize your JSON, **`serde`** will use the custom deserialization logic you provided for **`DataType`**. Here's an example of how you might deserialize your JSON:

```rust
use serde_json::from_str;
use uuid::Uuid;

let json_str = r#"
{
    "iv_provision": {
        "iv_provision_number": "1231231231234",
        "cost_approval": "cost_approval"
    },
    "type_of_provision": "type",
    "profession": "appli",
    "salary_type": "high",
    "date_from": "01.01.2024",
    "date_to": "01.02.2024",
    "insurance_product": {
        "tarif_number": "283282",
        "billing_category": "normal",
        "price": 28.34,
        "units": 20
    },
    "institution": "institution",
    "schule": "schule",
    "lehrgangs_bezeichnung": "lehrgangs_bezeichnung",
    "uek_ort": "uek_ort"
}
"#;

let provision_entity: Result<RioProvisionEntity, _> = from_str(json_str);

match provision_entity {
    Ok(entity) => println!("{:#?}", entity),
    Err(e) => println!("Error deserializing JSON: {}", e),
}

```

### **Step 4: Handle Potential Issues**

<br/>

- **Date Handling**: Your JSON includes date strings (e.g., **`"date_from": "01.01.2024"`**). The custom deserializer above treats all strings as **`DataType::String`**. If you need special handling for dates, consider extending the **`DataType`** enum and the deserializer logic to parse and handle date strings properly.
- **Number Precision**: The custom deserializer treats all numbers with a decimal point as **`f32`**. If you have **`f64`** precision numbers or need to distinguish between integers and floats more precisely, you'll need to adjust the logic accordingly.
