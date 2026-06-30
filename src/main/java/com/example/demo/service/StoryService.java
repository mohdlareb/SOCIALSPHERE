package com.example.demo.service;

import com.example.demo.entity.Story;
import com.example.demo.entity.User;
import com.example.demo.repository.StoryRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;


@Service
public class StoryService {

    @Autowired
    private StoryRepository storyRepository;

    @Autowired
    private UserRepository userRepository;

    public Story createStory(String username, String imageUrl) {
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Story story = new Story();
        story.setAuthor(author);
        story.setImageUrl(imageUrl);
        return storyRepository.save(story);
    }

    public List<Story> getActiveStories() {
        return storyRepository.findByExpiresAtAfterOrderByCreatedAtAsc(LocalDateTime.now());
    }

    public List<Story> getActiveStoriesForUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return storyRepository.findByAuthorAndExpiresAtAfterOrderByCreatedAtAsc(user, LocalDateTime.now());
    }

    public void deleteStory(Long storyId, String username) {
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new IllegalArgumentException("Story not found"));
        if (!story.getAuthor().getUsername().equals(username)) {
            throw new IllegalArgumentException("You can only delete your own stories");
        }
        storyRepository.delete(story);
    }

    // Runs every hour, permanently removes expired stories from the database
    @Transactional
    @Scheduled(fixedRate = 60000)   // or your existing schedule
    public void cleanupExpiredStories() {
        storyRepository.deleteByExpiresAtBefore(LocalDateTime.now());
    }
}