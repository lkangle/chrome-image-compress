import { getAppConfig, setAppConfig, type AppConfig } from "@/common/config"
import { Form } from "antd";
import { useCallback, useEffect, useState } from "react"

function useConfig() {
    const [config, setConfig] = useState<AppConfig>()
    const [form] = Form.useForm();

    useEffect(() => {
        getAppConfig().then(c => {
            setConfig(c)
            form.setFieldsValue(c);
        })
    }, [])

    const updateConfig = useCallback((opt: any) => {
        setConfig((prev) => {
            const n = { ...prev, ...(opt || {}) };
            setAppConfig(n);
            return n;
        });
    }, []);

    return {
        config, form, updateConfig
    }
}

export default useConfig