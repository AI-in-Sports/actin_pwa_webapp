job("Hello from host") {
    host("Run echo") {
        shellScript {
            content = """
                echo Hello World!
            """
        }

        requirements {
            workerTags("w1")
        }
    }
}