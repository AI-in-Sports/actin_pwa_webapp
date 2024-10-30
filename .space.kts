job("Hello from self-hosted worker") {
    host("Run echo") {
        shellScript {
            content = """
                echo "Hello World again!"
            """
        }
    }
}