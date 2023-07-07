/*
 * Copyright © 2015 The Gravitee team (http://gravitee.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package io.gravitee.rest.api.service.exceptions;

import java.util.HashMap;
import java.util.Map;

/**
 * @author Guillaume CUSNIEUX (azize at graviteesource.com)
 * @author GraviteeSource Team
 */
public class RatingAnswerNotFoundException extends AbstractNotFoundException {

    private final String answer;
    private final String rating;
    private final String api;

    public RatingAnswerNotFoundException(String answer) {
        this(answer, null, null);
    }

    public RatingAnswerNotFoundException(String answer, String rating, String api) {
        this.answer = answer;
        this.rating = rating;
        this.api = api;
    }

    @Override
    public String getMessage() {
        return (
            "Answer [" +
            answer +
            "] cannot be found" +
            (rating == null ? "" : " on rating [" + rating + "]") +
            (rating != null && api != null ? " and" : "") +
            (api == null ? "" : " on api [" + api + "]")
        );
    }

    @Override
    public String getTechnicalCode() {
        return "ratingAnswer.notFound";
    }

    @Override
    public Map<String, String> getParameters() {
        Map<String, String> parameters = new HashMap<>();
        parameters.put("answer", answer);
        parameters.put("rating", rating);
        parameters.put("api", api);
        return parameters;
    }
}
