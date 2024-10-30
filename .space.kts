job("Example") {
    // run the job in a default instance in cloud
    requirements {
        workerPool = WorkerPools.SPACE_CLOUD
    }

    host("Run echo") {
        shellScript {
            content = """
                echo "Hello from worker!"
            """
        }

        shellScript {
            content = """
                echo "Hello from worker one more time!"
            """
        }
    }

    container(displayName = "Say Hello", image = "ubuntu") {
        shellScript {
            content = """
                echo "I can run shellScript only once!"
            """
        }
    }
}