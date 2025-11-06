package com.example.todolist.service;


import com.example.todolist.model.Todo;
import com.example.todolist.repository.TodoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TodoService {

    private final TodoRepository repo;

    public TodoService(TodoRepository repo) {
        this.repo = repo;
    }

    public List<Todo> findAll() {
        return repo.findAll();
    }

    public Todo create(Todo t) {
        return repo.save(t);
    }

    public Optional<Todo> findById(Long id) {
        return repo.findById(id);
    }

    public Todo update(Todo t) {
        return repo.save(t);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
