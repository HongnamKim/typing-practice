package com.typingpractice.typing_practice_be.member.dto;

import static org.assertj.core.api.Assertions.assertThat;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.util.stream.Stream;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

class NicknameValidationTest {
  private static ValidatorFactory factory;
  private static Validator validator;

  @BeforeAll
  static void setUp() {
    factory = Validation.buildDefaultValidatorFactory();
    validator = factory.getValidator();
  }

  @AfterAll
  static void tearDown() {
    factory.close();
  }

  static Stream<Arguments> nicknames() {
    return Stream.of(
        Arguments.of(null, false),
        Arguments.of("", false),
        Arguments.of("  ", false),
        Arguments.of("あ", false),
        Arguments.of("か\u3099", false),
        Arguments.of("𠮷", false),
        Arguments.of("かな", true),
        Arguments.of("カナ", true),
        Arguments.of("漢字", true),
        Arguments.of("한글", true),
        Arguments.of("ab", true),
        Arguments.of("か\u3099き\u3099", true),
        Arguments.of("𠮷田", true),
        Arguments.of("あ".repeat(10), true),
        Arguments.of("𠮷".repeat(10), true),
        Arguments.of("か\u3099".repeat(10), true),
        Arguments.of("あ".repeat(11), false),
        Arguments.of("𠮷".repeat(11), false),
        Arguments.of("か\u3099".repeat(11), false));
  }

  @ParameterizedTest
  @MethodSource("nicknames")
  void checkNicknameCountsVisibleCharacters(String nickname, boolean valid) {
    assertThat(validator.validate(CheckNicknameRequest.create(nickname)).isEmpty()).isEqualTo(valid);
  }

  @ParameterizedTest
  @MethodSource("nicknames")
  void updateNicknameCountsVisibleCharacters(String nickname, boolean valid) {
    assertThat(validator.validate(UpdateNicknameRequest.create(nickname)).isEmpty()).isEqualTo(valid);
  }
}
